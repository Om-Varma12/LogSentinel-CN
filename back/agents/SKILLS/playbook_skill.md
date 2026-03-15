---
name: playbook-generator
description: >
  Generates a structured incident response playbook for a SOC analyst based on a raw HTTP/access
  log dict and a numeric risk score. Use this skill whenever log data + a score are provided and
  the output needed is a step-by-step response plan, investigation checklist, or remediation guide —
  even if the user just says "what should I do about this log" or "give me next steps". Trigger
  any time actionable response steps are needed from log data, not just a summary.
---

# Playbook Generator Skill

Takes a raw log dict + risk score and produces a structured, actionable incident response
playbook tailored to the specific threat pattern in the log.

---

## Risk-to-Response Mapping

| Score     | Risk     | Immediate stance             | Outcome floor         |
|-----------|----------|------------------------------|-----------------------|
| 0-39.9    | 🟢 Low    | Observe, log for pattern     | Close / Flag          |
| 40-69.9   | 🟡 Medium | Investigate actively         | Flag / Open ticket    |
| 70-89.9   | 🔴 High   | Contain the IP               | Open ticket / Escalate|
| 90-100    | 🚨 Critical | Isolate + escalate now     | Escalate immediately  |

---

## Threat Pattern Recognition

The model should map log signals to known threat types. Key patterns:

| Signal                                           | Likely Threat                        |
|--------------------------------------------------|--------------------------------------|
| DELETE/PUT on `/admin*` path                     | Unauthorized admin manipulation      |
| GET on `/admin*` with 200                        | Successful admin recon / access      |
| Any method + 401/403 repeatedly                  | Brute force / credential stuffing    |
| 502/503 on sensitive path                        | Probing for misconfiguration         |
| Very high processing time (>5000ms)              | Slowloris / DoS / heavy injection    |
| HTTP/1.0 with modern browser UA                  | Possibly spoofed user-agent          |
| Bot/crawler UA string                            | Automated scanning                   |
| Unusual port or path traversal (`../`)           | Path traversal / LFI attempt         |

---

## Output Rules

1. **Part 1 (Threat Context)**: Name the threat type first, then one line of context from the log.
2. **Part 2 (Immediate Actions)**: Numbered. Start each step with a verb. Reference actual log values.
3. **Part 3 (Investigation Steps)**: Numbered. Each step should point to a concrete artifact —
   a log source, a query type, a correlation check, or a timeframe.
4. **Part 4 (Recommended Outcome)**: One of the 4 fixed options + one condition sentence.
5. Never give advice that isn't grounded in the specific log provided.

---

## Example

**Input:**
```
Details: {'IP': '233.223.117.90', 'Timestamp': '[27/Dec/2037:12:00:00 +0530]',
  'Request Method': 'DELETE', 'Request': '/usr/admin HTTP/1.0',
  'Status Code': 502, 'Response Size': 4981,
  'Client s/w info': 'Mozilla/5.0 ... Edge/89.0.774.68',
  'Request Processing Time': 45}
Score: 59.6
```

**Expected Output:**
```
THREAT CONTEXT
Unauthorized admin deletion attempt — IP 233.223.117.90 issued a DELETE against /usr/admin,
which failed with a 502, suggesting the endpoint exists but the operation was blocked upstream.

IMMEDIATE ACTIONS
1. Block IP 233.223.117.90 at the WAF/firewall level temporarily pending investigation.
2. Check if this IP has made prior requests to /usr/admin or other admin paths in the last 24h.
3. Verify the 502 is consistent — confirm the admin endpoint is not partially accessible.

INVESTIGATION STEPS
1. Pull all requests from 233.223.117.90 across all log sources for the past 7 days.
2. Check for other IPs targeting /usr/admin with DELETE or PUT in the same timeframe.
3. Correlate with auth logs — was there a login attempt from this IP before the DELETE?
4. Inspect the 502 response body if logged — determine if it's a gateway error or an app-level block.
5. Check threat intel feeds for 233.223.117.90 — known scanner, botnet node, or clean?

RECOMMENDED OUTCOME
Open incident ticket. Escalate to IR team if the IP reappears or if auth logs show a
preceding login attempt.
```

---

## Notes for Agent Builders

- This agent pairs naturally with the **log-summarizer** agent — summarizer runs first for triage,
  playbook generator runs when a response is needed.
- For batch processing, generate one playbook per log — do not merge multiple logs into one playbook.
- If `Request Processing Time` is missing, skip any performance-related investigation steps.
- The 4 fixed outcome options are intentional — they force a clear decision, not a hedge.