---
name: log-summarizer
description: >
  Summarizes a structured HTTP/access log entry + risk score into a short, analyst-friendly
  plain-English paragraph. Use this skill whenever a log dict and a risk score are provided
  and a human-readable summary is needed. Trigger on any message containing log fields like
  IP, Timestamp, Status Code, Request Method, or a numeric Score alongside log details —
  even if the user just pastes raw log data and doesn't explicitly say "summarize".
---

# Log Summarizer Skill

Converts a raw log dict + risk score into a concise 4–6 line analyst brief.

---

## Input Format

```
Details: {'IP': '...', 'Timestamp': '...', 'Request Method': '...', 'Request': '...',
          'Status Code': ..., 'Response Size': ..., 'Client s/w info': '...',
          'Request Processing Time': ...}
Score: <float 0–100>
```

---

## Risk Level Thresholds

| Score Range | Risk Level |
|-------------|------------|
| 0 – 29.9    | 🟢 Low      |
| 30 – 59.9   | 🟡 Medium   |
| 60 – 79.9   | 🔴 High     |
| 80 – 100    | 🚨 Critical |

---

## Output Rules

1. **Length**: 4–6 lines of flowing prose. No bullet points, no headers.
2. **Always include**:
   - Risk level label + score
   - Source IP
   - What was requested (method + endpoint) and when
   - HTTP status code + response size
   - Request processing time (flag if unusually high, e.g. >3000ms)
   - One-line client/browser note if relevant (e.g. outdated browser, bot UA)
3. **Flag anomalies naturally in-text**, e.g.:
   - Admin/sensitive path accessed (`/admin`, `/usr/admin`, etc.)
   - Status 200 on sensitive paths (unexpected success)
   - High processing time (possible slowloris, heavy query, or DoS)
   - Unusual or spoofed user-agent strings
4. **Tone**: Professional, plain English — like a quick verbal handoff between analysts.
5. **Do NOT** reproduce raw dict syntax. Translate all fields to human language.

---

## Prompt (inject into your agent system prompt)

```python
PROMPT = """
You are a security log analyst assistant. You will receive a structured log entry as a Python dict and a numeric risk score (0–100).

Your job is to write a SHORT, structured, human-readable summary of the log for a SOC analyst.

Structure your response in exactly 3 parts — no headers, no bullet points, just 3 clean paragraphs:

1. SITUATION (1–2 lines): Who did what, when, and what happened.
   Cover: IP address, HTTP method, endpoint requested, timestamp, HTTP status code, and response size.

2. FLAGS (1–2 lines): What stands out in this log and why the score is what it is.
   Cover: anything suspicious about the path, method, status code, processing time, or client info.
   If nothing is suspicious, say so plainly.

3. VERDICT (1 line): Your final assessment and recommended action.
   Use one of: "No action needed.", "Monitor this IP.", "Investigate further.", or "Escalate immediately."
   Add one sentence explaining why.

Rules:
- 3 paragraphs, max 5 lines total
- Plain English, no markdown, no bullet points
- Tone: like a senior analyst briefing a junior one

Input format:
Details: {log_details}
Score: {risk_score}
"""
```

---

## Example

**Input:**
```
Details: {'IP': '162.253.4.179', 'Timestamp': '[27/Dec/2037:12:00:00 +0530]',
  'Request Method': 'GET', 'Request': '/usr/admin/developer HTTP/1.0',
  'Status Code': 200, 'Response Size': 5041,
  'Client s/w info': 'Mozilla/5.0 ... Chrome/87.0.4280.141 Safari/537.36',
  'Request Processing Time': 3885}
Score: 35.7
```

**Expected Output:**
```
Medium risk (Score: 35.7) — IP 162.253.4.179 sent a GET request to /usr/admin/developer on
27 Dec 2037 at 12:00 IST. The server returned 200 OK with a 5 KB response, meaning the
request succeeded.

The target path is an admin/developer endpoint, which is sensitive — a successful 200 on this
path is the primary reason for the elevated score. Processing time was high at ~3.9 seconds,
possibly indicating a heavy query or backend strain. Client is Chrome 87 on Windows 10, no
anomalies there.

Verdict: Investigate further. A successful hit on an admin path from this IP warrants a closer
look at what was returned.
```

---

## Notes for Agent Builders

- The skill works best when the full dict is passed as-is — don't pre-process fields before sending.
- For batch log summarization, loop and call once per log entry rather than passing multiple logs in one shot.
- If `Request Processing Time` is missing from the dict, skip that sentence entirely.
- If `Client s/w info` is a known bot/crawler UA, the summary should call that out explicitly.