"""
Log generator for LogSentinel-CN pipeline.

The pipeline (run_pipeline.py) calls get_logs() ONCE at startup,
then iterates over the returned list with a 5-second gap between each log.

Log format matches pipeline/parser.py expectations:
  IP - - [timestamp] "METHOD /path HTTP/1.0" status size "-" "user-agent" proc_time

Realistic endpoints: /api/v1/users, /login, /admin, /config, /health, etc.
Risk-relevant patterns: sqlmap/nikto/nmap user-agents, DELETE/PUT methods,
                        admin paths, login paths, high status codes, slow responses.
"""

import random
import hashlib
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Realistic endpoint taxonomy — mirrors what the analyzer打分 logic expects
# ---------------------------------------------------------------------------
ENDPOINTS = {
    # Clean / low-risk
    "/api/v1/health":           {"methods": ["GET"],          "status": [200],             "weight": 25 },
    "/api/v1/metrics":          {"methods": ["GET"],          "status": [200],             "weight": 15 },
    "/api/v1/users":            {"methods": ["GET", "POST"], "status": [200, 201],        "weight": 20 },
    "/api/v1/dashboard":        {"methods": ["GET"],          "status": [200],             "weight": 10 },
    "/api/v2/stream":           {"methods": ["GET"],          "status": [200],             "weight": 5  },
    "/webhook":                 {"methods": ["POST"],         "status": [200, 201],        "weight": 5  },

    # Medium-risk (login, auth — brute-force targets)
    "/login":                   {"methods": ["GET", "POST"], "status": [200, 401, 403],   "weight": 10 },
    "/api/v1/auth/login":       {"methods": ["POST"],         "status": [200, 401],        "weight": 8  },
    "/api/v1/auth/logout":      {"methods": ["POST"],         "status": [200, 401],        "weight": 3  },
    "/register":                {"methods": ["GET", "POST"], "status": [200, 201, 400],   "weight": 5  },

    # High-risk (admin/config — sqlmap/scanner targets)
    "/admin":                   {"methods": ["GET", "POST", "PUT", "DELETE"], "status": [200, 401, 403, 404], "weight": 8 },
    "/admin/panel":             {"methods": ["GET"],          "status": [200, 403],        "weight": 5  },
    "/admin/users":             {"methods": ["GET", "POST", "DELETE"], "status": [200, 401, 403], "weight": 4 },
    "/api/v1/settings":          {"methods": ["GET", "PUT"],  "status": [200, 401],        "weight": 5  },
    "/api/v1/profile":           {"methods": ["GET", "PUT"],  "status": [200, 401],        "weight": 5  },
    "/config":                  {"methods": ["GET", "POST"], "status": [200, 403],        "weight": 3  },
    "/etc/config":               {"methods": ["GET"],          "status": [403, 404],        "weight": 2  },

    # Path traversal / enumeration targets
    "/usr":                     {"methods": ["GET"],          "status": [403, 404],        "weight": 4  },
    "/bin":                     {"methods": ["GET"],          "status": [403, 404],        "weight": 3  },
    "/api/v1/logs":             {"methods": ["GET"],          "status": [200, 401],        "weight": 5  },
    "/api/v1/alerts":           {"methods": ["GET", "POST"], "status": [200, 401],        "weight": 4  },

    # Destructive methods on any endpoint (weight is for method selection, not endpoint)
    "_DELETE_": {"methods": ["DELETE"], "status": [204, 401, 403, 404], "weight": 3},
    "_PUT_":    {"methods": ["PUT"],    "status": [200, 401, 403],      "weight": 3},
}

# Weight pool for random endpoint selection
_endpoint_pool = []
for ep, cfg in ENDPOINTS.items():
    for _ in range(cfg["weight"]):
        _endpoint_pool.append((ep, cfg))

# ---------------------------------------------------------------------------
# User agents — normal + suspicious (triggers analyzer scoring)
# ---------------------------------------------------------------------------
USER_AGENTS = {
    "normal": [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/121.0",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1",
        "python-requests/2.31.0",
        "curl/8.4.0",
        "Wget/1.21.3",
    ],
    "suspicious": [
        "sqlmap/1.8.2-dev (http://sqlmap.org)",          # +50 score in analyzer
        "sqlmap/1.8.2 (http://sqlmap.org)",
        "nikto/2.5.0",
        "nmap/7.94",
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "python-requests/2.31.0 (mass scan)",
        "masscan/1.3 (https://github.com/robertdavidgraham/masscan)",
    ],
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _random_ip() -> str:
    return f"{random.randint(1, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"


def _timestamp_now() -> str:
    """Apache-compatible timestamp: 10/Jan/2026:14:32:05 +05:30"""
    now = datetime.now(timezone.utc).astimezone()
    tz_str = now.strftime("%z")
    # +0530 → +05:30
    tz_formatted = f"{tz_str[:3]}:{tz_str[3:]}"
    return now.strftime(f"%d/%b/%Y:%H:%M:%S {tz_formatted}")


def _response_size(status: int) -> int:
    """Response size distribution by status code."""
    if status >= 500:
        return random.randint(100, 800)        # error responses are small
    if status >= 400:
        return random.randint(200, 1500)       # client errors slightly bigger
    if status == 204:
        return 0
    return random.randint(500, 50000)           # normal responses vary widely


def _proc_time(method: str, endpoint: str, status: int) -> int:
    """Slow responses flag suspicious activity (+5 score threshold >2500ms)."""
    base = random.randint(10, 800)
    # Destructive methods often trigger slower operations
    if method in ("DELETE", "PUT"):
        base += random.randint(500, 1500)
    # Admin endpoints may trigger expensive auth checks
    if "admin" in endpoint or "config" in endpoint:
        base += random.randint(200, 800)
    # Error responses may still process fully
    if status >= 400:
        base += random.randint(100, 400)
    return min(base, 10000)


# ---------------------------------------------------------------------------
# Main generation
# ---------------------------------------------------------------------------

def get_logs() -> list[str]:
    """
    Called once by run_pipeline.py.
    Returns a list of log strings to be iterated with 5-second gaps.

    Mix of clean and suspicious logs so the ML model sees varied data
    and the rule-based analyzer triggers on sqlmap/admin/delete/put patterns.
    """
    LOG_COUNT = 100         # one pipeline run = 100 logs × 5s ≈ ~8 minutes
    SUSPICIOUS_RATIO = 0.35  # ~35% suspicious to have meaningful incidents

    logs = []
    for i in range(LOG_COUNT):
        # Decide if this log should be suspicious
        is_suspicious = random.random() < SUSPICIOUS_RATIO

        ip = _random_ip()
        timestamp = _timestamp_now()

        if is_suspicious:
            # Force a suspicious user agent + method combo
            client = random.choice(USER_AGENTS["suspicious"])
            # Pick endpoint — biased toward high-value targets for scanners
            endpoint = random.choices(
                ["/admin", "/admin/panel", "/config", "/etc/config", "/usr", "/bin",
                 "/api/v1/settings", "/api/v1/auth/login", "/login"],
                weights=[3, 2, 2, 1, 1, 1, 1, 2, 2]
            )[0]
            method = random.choice(["GET", "POST", "PUT", "DELETE"])
            status = random.choice([200, 401, 403, 404, 500])
        else:
            client = random.choice(USER_AGENTS["normal"])
            endpoint, cfg = random.choice(_endpoint_pool)
            # Handle _DELETE_ / _PUT_ sentinel — override method selection
            if endpoint in ("_DELETE_", "_PUT_"):
                method = endpoint.strip("_")
                endpoint = random.choice(list(ENDPOINTS.keys())[8:15])  # pick a real endpoint
                cfg = ENDPOINTS[endpoint]
            else:
                method = random.choice(cfg["methods"])
            status = random.choice(cfg["status"])

        size = _response_size(status)
        proc_time = _proc_time(method, endpoint, status)

        log = (
            f'{ip} - - [{timestamp}] '
            f'"{method} {endpoint} HTTP/1.0" '
            f'{status} {size} "-" '
            f'"{client}" {proc_time}'
        )
        logs.append(log)

    return logs


# ---------------------------------------------------------------------------
# Dev / CLI test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print(f"Generating {20} sample logs...\n")
    for log in get_logs():
        print(log)