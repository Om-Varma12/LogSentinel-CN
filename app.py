import streamlit as st
import re
import requests

API_URL = "http://localhost:8000"

st.set_page_config(
    page_title="SENTINEL // SOC Dashboard",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ─────────────────────────────────────────
# SESSION STATE
# ─────────────────────────────────────────
if "incidents"      not in st.session_state: st.session_state.incidents      = []
if "selected_id"    not in st.session_state: st.session_state.selected_id    = None
if "terminal_lines" not in st.session_state: st.session_state.terminal_lines = []
if "last_index"     not in st.session_state: st.session_state.last_index     = 0
if "done_notified"  not in st.session_state: st.session_state.done_notified  = False

# ─────────────────────────────────────────
# CSS
# ─────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Rajdhani', sans-serif;
    background-color: #0e0e0e !important;
    color: #f0f0f0 !important;
}
.stApp { background: #0e0e0e !important; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0e0e0e; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

/* HEADER */
.soc-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 0 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 20px;
}
.soc-title {
    font-family: 'Orbitron', monospace; font-size: 22px; font-weight: 900;
    color: #ffffff; letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(255,255,255,0.1);
}
.soc-sub {
    font-family: 'Share Tech Mono', monospace; font-size: 10px;
    color: rgba(255,255,255,0.3); letter-spacing: 4px; margin-top: 3px;
}
.live-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px; border: 1px solid rgba(255,255,255,0.15);
    border-radius: 2px; font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: #ffffff; letter-spacing: 2px;
    background: rgba(255,255,255,0.04);
}
.live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #ffffff;
    box-shadow: 0 0 8px rgba(255,255,255,0.7);
    animation: pulse-dot 1.8s ease-in-out infinite;
}
@keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.3; transform:scale(0.6); }
}

/* STAT CARDS */
.stat-row {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 10px; margin-bottom: 20px;
}
.stat-card {
    padding: 14px 16px; background: #161616;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px; position: relative; overflow: hidden;
}
.stat-label {
    font-family: 'Share Tech Mono', monospace; font-size: 9px;
    color: rgba(255,255,255,0.4); letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 6px;
}
.stat-val {
    font-family: 'Orbitron', monospace; font-size: 26px;
    font-weight: 700; color: #ffffff; line-height: 1;
}

/* SECTION HEADER */
.sec-hdr {
    font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 700;
    color: rgba(255,255,255,0.45); letter-spacing: 5px; text-transform: uppercase;
    margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
}
.sec-hdr::after {
    content:''; flex:1; height:1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
}

/* INCIDENT CARD */
.inc-card {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 18px; margin-bottom: 10px;
    background: #161616; border: 1px solid rgba(255,255,255,0.07);
    border-left: 3px solid rgba(255,255,255,0.15);
    border-radius: 4px; position: relative; overflow: hidden;
}
.inc-card.high   { border-left-color: #ff4444; }
.inc-card.medium { border-left-color: #ffaa00; }
.inc-card.low    { border-left-color: #00cc55; }
.ring-wrap {
    position: relative; width: 60px; height: 60px; flex-shrink: 0;
}
.ring-wrap svg { transform: rotate(-90deg); }
.ring-score {
    position: absolute; top:50%; left:50%;
    transform: translate(-50%,-50%);
    font-family: 'Orbitron', monospace; font-size: 15px; font-weight: 900;
}
.card-body { flex:1; min-width:0; }
.card-top  { display:flex; align-items:center; gap:10px; margin-bottom:5px; flex-wrap:wrap; }
.card-id {
    font-family: 'Share Tech Mono', monospace; font-size:11px;
    color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.06);
    padding:2px 8px; border-radius:2px; letter-spacing:1px;
}
.card-title {
    font-family:'Rajdhani',sans-serif; font-size:17px;
    font-weight:700; color:#ffffff; letter-spacing:0.5px;
}
.card-meta {
    font-family:'Share Tech Mono',monospace; font-size:10px;
    color:rgba(255,255,255,0.4); margin-bottom:8px;
    display:flex; align-items:center; gap:16px; flex-wrap:wrap;
}
.card-tags { display:flex; gap:7px; flex-wrap:wrap; }
.tag {
    font-family:'Share Tech Mono',monospace; font-size:10px;
    padding:3px 9px; border-radius:2px; border:1px solid; letter-spacing:0.5px;
}
.tag-red   { color:#ff6666; border-color:rgba(255,68,68,0.35);  background:rgba(255,68,68,0.08); }
.tag-amber { color:#ffbb44; border-color:rgba(255,170,0,0.35);  background:rgba(255,170,0,0.08); }
.tag-green { color:#44cc77; border-color:rgba(0,204,85,0.35);   background:rgba(0,204,85,0.08);  }
.tag-blue  { color:#66aaff; border-color:rgba(80,150,255,0.35); background:rgba(80,150,255,0.08);}
.tag-gray  { color:rgba(255,255,255,0.5); border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.04);}
.card-right { text-align:right; flex-shrink:0; min-width:130px; }
.status-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:2px;
    font-family:'Share Tech Mono',monospace; font-size:10px;
    letter-spacing:1px; margin-bottom:8px;
}
.pill-high   { background:rgba(255,68,68,0.12);  color:#ff6666; border:1px solid rgba(255,68,68,0.25);  }
.pill-medium { background:rgba(255,170,0,0.12); color:#ffbb44; border:1px solid rgba(255,170,0,0.25);  }
.pill-low    { background:rgba(0,204,85,0.12);  color:#44cc77; border:1px solid rgba(0,204,85,0.25);   }
.pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }
.view-lbl {
    font-family:'Share Tech Mono',monospace; font-size:10px;
    color:rgba(255,255,255,0.4); letter-spacing:1px;
}

/* DETAIL */
.detail-header {
    padding:20px; background:#161616;
    border:1px solid rgba(255,255,255,0.08);
    border-radius:4px; margin-bottom:14px;
}
.detail-title {
    font-family:'Orbitron',monospace; font-size:18px;
    font-weight:700; color:#ffffff; margin-bottom:8px; letter-spacing:1px;
}
.detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:14px; }
.detail-row  { display:flex; gap:10px; padding:8px 12px; background:rgba(255,255,255,0.02); border-left:2px solid rgba(255,255,255,0.1); }
.detail-key  { font-family:'Share Tech Mono',monospace; font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:2px; text-transform:uppercase; min-width:90px; }
.detail-val  { font-family:'Share Tech Mono',monospace; font-size:12px; color:#f0f0f0; font-weight:600; }

.threat-block {
    padding:18px 20px; border:1px solid rgba(255,255,255,0.07);
    border-left:4px solid rgba(255,255,255,0.2);
    background:rgba(255,255,255,0.02); border-radius:4px;
    font-family:'Share Tech Mono',monospace; font-size:13px;
    line-height:2.1; color:#f0f0f0; margin-bottom:14px; position:relative;
}
.threat-block::before {
    content:'// THREAT_ANALYSIS'; display:block; font-size:9px;
    color:rgba(255,255,255,0.3); letter-spacing:3px; margin-bottom:10px;
}
.threat-block.high   { border-left-color:#ff4444; }
.threat-block.medium { border-left-color:#ffaa00; }
.threat-block.low    { border-left-color:#00cc55; }

.playbook-block {
    padding:18px 20px; border:1px solid rgba(80,150,255,0.15);
    border-left:4px solid #5096ff; background:rgba(80,150,255,0.03);
    border-radius:4px; font-family:'Share Tech Mono',monospace;
    font-size:13px; line-height:2.1; color:#f0f0f0; position:relative;
}
.playbook-block::before {
    content:'// RESPONSE_PLAYBOOK'; display:block; font-size:9px;
    color:rgba(80,150,255,0.5); letter-spacing:3px; margin-bottom:10px;
}
.playbook-step {
    display:flex; align-items:flex-start; gap:12px;
    padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.04);
}
.step-num {
    font-family:'Orbitron',monospace; font-size:10px; padding:2px 6px;
    border:1px solid rgba(80,150,255,0.3); color:#5096ff; border-radius:2px;
    min-width:28px; text-align:center; flex-shrink:0; margin-top:2px;
}

/* TERMINAL */
.terminal-wrap {
    background:#141414; border:1px solid rgba(255,255,255,0.07);
    border-radius:4px; padding:14px 16px;
    min-height:60vh; max-height:80vh; overflow-y:auto;
}
.term-hdr {
    font-family:'Share Tech Mono',monospace; font-size:10px;
    color:rgba(255,255,255,0.3); letter-spacing:3px;
    margin-bottom:12px; padding-bottom:8px;
    border-bottom:1px solid rgba(255,255,255,0.06);
    display:flex; justify-content:space-between;
}
.t-line { font-family:'Share Tech Mono',monospace; font-size:12px; margin-bottom:4px; line-height:1.6; }
.t-hi   { color:#ffffff; }
.t-lo   { color:rgba(255,255,255,0.45); }
.t-err  { color:#ff6666; }
.t-warn { color:#ffbb44; }
.t-ok   { color:#44cc77; }
.t-cur  { color:rgba(255,255,255,0.6); animation:pulse-dot 1s infinite; }

/* BUTTON OVERRIDES */
.stButton > button {
    font-family:'Orbitron',monospace !important; font-size:10px !important;
    font-weight:700 !important; letter-spacing:2px !important;
    color:#ffffff !important; background:transparent !important;
    border:1px solid rgba(255,255,255,0.2) !important;
    padding:10px 24px !important; border-radius:2px !important;
    transition:all 0.2s ease !important;
}
.stButton > button:hover {
    background:rgba(255,255,255,0.06) !important;
    border-color:rgba(255,255,255,0.5) !important;
}

/* hide the tiny select buttons visually — they sit behind cards */
div[data-testid="stHorizontalBlock"] { gap:0 !important; }

#MainMenu { visibility:hidden; }
footer    { visibility:hidden; }
header    { visibility:hidden; }
.block-container { padding-top:16px !important; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────
def risk_level(score):
    if score <= 30: return "LOW",    "#00cc55", "low"
    if score <= 60: return "MEDIUM", "#ffaa00", "medium"
    return               "HIGH",    "#ff4444", "high"

def add_terminal(txt, style="lo"):
    st.session_state.terminal_lines.append((txt, style))
    if len(st.session_state.terminal_lines) > 80:
        st.session_state.terminal_lines = st.session_state.terminal_lines[-80:]

def derive_title(method, endpoint, status_code):
    ep = endpoint.lower()
    if "login"  in ep: return "Authentication Attempt"
    if "admin"  in ep: return "Admin Endpoint Access"
    if "config" in ep: return "Config File Access"
    if method == "DELETE": return "Destructive Operation Detected"
    if method == "PUT":    return "Data Modification Request"
    if status_code >= 500: return "Server Error Triggered"
    if status_code >= 400: return "Suspicious Client Request"
    return f"{method} Request — {endpoint[:25]}"

def derive_mitre(method, endpoint, client_info):
    ep = endpoint.lower()
    ci = client_info.lower()
    if "sqlmap" in ci:     return "T1190", "Exploit Public App"
    if "login"  in ep:     return "T1110", "Brute Force"
    if "admin"  in ep:     return "T1078", "Valid Accounts"
    if "config" in ep:     return "T1552", "Unsecured Credentials"
    if method == "DELETE": return "T1485", "Data Destruction"
    if method == "PUT":    return "T1565", "Data Manipulation"
    return "T1071", "App Layer Protocol"

def build_incident_from_api(data, abs_index):
    p        = data["parsed"]
    score    = int(round(data["risk_score"]))
    lvl, color, cls = risk_level(score)
    method   = p["Request Method"]
    endpoint = p["Request"].split()[0]
    status   = p["Status Code"]
    client   = p.get("Client s/w info", "")
    mid, mname = derive_mitre(method, endpoint, client)

    ts_match = re.search(r':(\d{2}:\d{2}:\d{2})', p["Timestamp"])
    ts = ts_match.group(1) + " UTC" if ts_match else p["Timestamp"]

    playbook_lines = [ln.strip() for ln in data["playbook"].splitlines() if ln.strip()]

    inc = {
        "id":         f"#INC-{1000 + abs_index + 1}",
        "title":      derive_title(method, endpoint, status),
        "raw":        data["raw"],
        "parsed":     p,
        "endpoint":   endpoint,
        "score":      score,
        "level":      lvl,
        "color":      color,
        "cls":        cls,
        "mitre_id":   mid,
        "mitre_name": mname,
        "action":     f"{method} {endpoint}",
        "ts":         ts,
        "analysis":   data["summary"],
        "playbook":   playbook_lines,
    }

    sty = "ok" if score <= 30 else "warn" if score <= 60 else "err"
    add_terminal(f"[IN]    Log ingested → {inc['id']}", "lo")
    add_terminal(f"[PARSE] {method} {endpoint} | {status}", "lo")
    add_terminal(f"[RISK]  {score}/100 → {lvl} THREAT", sty)
    add_terminal(f"[QUEUE] {inc['id']} — {inc['title'][:35]}", "hi")
    return inc

def fetch_new_incidents():
    try:
        resp = requests.get(
            f"{API_URL}/incidents",
            params={"since": st.session_state.last_index},
            timeout=2,
        )
        if resp.status_code != 200:
            return None

        data      = resp.json()
        new_items = data.get("incidents", [])
        total     = data.get("total", 0)
        status    = data.get("status", {})

        offset = st.session_state.last_index
        for i, item in enumerate(new_items):
            inc = build_incident_from_api(item, offset + i)
            st.session_state.incidents.insert(0, inc)
        st.session_state.last_index = total

        if len(st.session_state.incidents) > 50:
            st.session_state.incidents = st.session_state.incidents[:50]

        if status.get("done") and not new_items and not st.session_state.done_notified:
            add_terminal("[SYSTEM] Pipeline complete — all logs processed", "ok")
            st.session_state.done_notified = True

        return status
    except requests.exceptions.ConnectionError:
        add_terminal("[SYSTEM] Waiting for pipeline server...", "lo")
        return None
    except Exception as e:
        add_terminal(f"[ERROR]  {str(e)[:60]}", "err")
        return None

# ─────────────────────────────────────────
# INGEST ENGINE  (polls FastAPI on each rerun)
# ─────────────────────────────────────────
fetch_new_incidents()

# ─────────────────────────────────────────
# HTML HELPERS
# ─────────────────────────────────────────
def ring_svg(score, color, size=60):
    r = 22; circ = 2*3.14159*r; fill = (score/100)*circ
    return f"""<div class="ring-wrap" style="width:{size}px;height:{size}px;">
      <svg width="{size}" height="{size}" viewBox="0 0 {size} {size}">
        <circle cx="{size//2}" cy="{size//2}" r="{r}" fill="none"
                stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
        <circle cx="{size//2}" cy="{size//2}" r="{r}" fill="none"
                stroke="{color}" stroke-width="4" stroke-linecap="round"
                stroke-dasharray="{fill:.1f} {circ:.1f}"
                style="filter:drop-shadow(0 0 4px {color}88)"/>
      </svg>
      <div class="ring-score" style="color:{color};">{score}</div>
    </div>"""

def pill_html(inc):
    c = {"HIGH":"pill-high","MEDIUM":"pill-medium","LOW":"pill-low"}[inc["level"]]
    return f'<div class="status-pill {c}"><div class="pill-dot"></div>{inc["level"]}</div>'

def sev_tag(inc):
    c = {"HIGH":"tag-red","MEDIUM":"tag-amber","LOW":"tag-green"}[inc["level"]]
    return f'<span class="tag {c}">{inc["level"]} Severity</span>'

# ─────────────────────────────────────────
# HEADER
# ─────────────────────────────────────────
st.markdown("""
<div class="soc-header">
  <div>
    <div class="soc-title">SENTINEL SOC</div>
    <div class="soc-sub">SECURITY OPERATIONS CENTER // REAL-TIME THREAT MONITOR</div>
  </div>
  <div class="live-badge"><div class="live-dot"></div>INGESTING LIVE</div>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────
# STAT ROW
# ─────────────────────────────────────────
total  = len(st.session_state.incidents)
highs  = sum(1 for i in st.session_state.incidents if i["level"]=="HIGH")
meds   = sum(1 for i in st.session_state.incidents if i["level"]=="MEDIUM")
lows   = sum(1 for i in st.session_state.incidents if i["level"]=="LOW")

st.markdown(f"""
<div class="stat-row">
  <div class="stat-card">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;
         background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);"></div>
    <div class="stat-label">Total Incidents</div>
    <div class="stat-val">{total:03d}</div>
  </div>
  <div class="stat-card">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;
         background:linear-gradient(90deg,transparent,rgba(255,68,68,0.6),transparent);"></div>
    <div class="stat-label">High Severity</div>
    <div class="stat-val" style="color:#ff4444;">{highs:03d}</div>
  </div>
  <div class="stat-card">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;
         background:linear-gradient(90deg,transparent,rgba(255,170,0,0.6),transparent);"></div>
    <div class="stat-label">Medium Severity</div>
    <div class="stat-val" style="color:#ffaa00;">{meds:03d}</div>
  </div>
  <div class="stat-card">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;
         background:linear-gradient(90deg,transparent,rgba(0,204,85,0.6),transparent);"></div>
    <div class="stat-label">Low Severity</div>
    <div class="stat-val" style="color:#00cc55;">{lows:03d}</div>
  </div>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────
# MAIN LAYOUT  —  incidents 75%  |  terminal 25%
# ─────────────────────────────────────────
col_main, col_term = st.columns([3, 1])

# ── TERMINAL (right 25%) ──────────────────
with col_term:
    st.markdown("<div class='sec-hdr'>LIVE TERMINAL</div>", unsafe_allow_html=True)
    lines_html = "".join(
        f"<div class='t-line t-{sty}'>{txt}</div>"
        for txt, sty in st.session_state.terminal_lines[-50:]
    )
    lines_html += "<div class='t-line t-cur'>█</div>"
    st.markdown(f"""
    <div class="terminal-wrap">
      <div class="term-hdr"><span>SENTINEL:// STREAM</span><span>● LIVE</span></div>
      {lines_html}
    </div>""", unsafe_allow_html=True)

# ── INCIDENTS (left 75%) ─────────────────
with col_main:
    if st.session_state.selected_id is None:
        # ── LIST VIEW ──
        st.markdown("<div class='sec-hdr'>INCIDENT QUEUE</div>", unsafe_allow_html=True)

        if not st.session_state.incidents:
            st.markdown("""
            <div style='font-family:Share Tech Mono,monospace;font-size:12px;
                 color:rgba(255,255,255,0.3);padding:60px;text-align:center;'>
                 Awaiting first log ingestion...
            </div>""", unsafe_allow_html=True)
        else:
            for inc in st.session_state.incidents:
                mitre_tag = f'<span class="tag tag-blue">MITRE: {inc["mitre_id"]}</span>'
                act_tag   = f'<span class="tag tag-gray">{inc["action"]}</span>'

                st.markdown(f"""
                <div class="inc-card {inc['cls']}">
                  {ring_svg(inc['score'], inc['color'])}
                  <div class="card-body">
                    <div class="card-top">
                      <span class="card-id">{inc['id']}</span>
                      <span class="card-title">{inc['title']}</span>
                    </div>
                    <div class="card-meta">
                      <span>⏱ {inc['ts']}</span>
                      <span>⬡ {inc['parsed']['IP']}</span>
                      <span>↗ {inc['endpoint']}</span>
                    </div>
                    <div class="card-tags">
                      {mitre_tag}{sev_tag(inc)}{act_tag}
                    </div>
                  </div>
                  <div class="card-right">
                    {pill_html(inc)}
                    <div class="view-lbl">View Details ›</div>
                  </div>
                </div>
                """, unsafe_allow_html=True)

                if st.button(f"Open {inc['id']}", key=f"btn_{inc['id']}"):
                    st.session_state.selected_id = inc["id"]
                    st.rerun()

    else:
        # ── DETAIL VIEW ──
        inc = next((i for i in st.session_state.incidents if i["id"]==st.session_state.selected_id), None)

        if st.button("← BACK TO INCIDENT QUEUE"):
            st.session_state.selected_id = None
            st.rerun()

        if inc:
            p = inc["parsed"]

            # Header
            st.markdown(f"""
            <div class="detail-header">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
                {ring_svg(inc['score'], inc['color'], 72)}
                <div>
                  <div style="font-family:Share Tech Mono,monospace;font-size:11px;
                       color:rgba(255,255,255,0.35);margin-bottom:5px;">
                       {inc['id']} &nbsp;·&nbsp; {inc['ts']}
                  </div>
                  <div class="detail-title">{inc['title']}</div>
                  <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
                    {pill_html(inc)}
                    <span class="tag tag-blue">MITRE: {inc['mitre_id']} — {inc['mitre_name']}</span>
                    <span class="tag tag-gray">{inc['action']}</span>
                  </div>
                </div>
              </div>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-key">SOURCE IP</span><span class="detail-val">{p['IP']}</span></div>
                <div class="detail-row"><span class="detail-key">METHOD</span><span class="detail-val">{p['Request Method']}</span></div>
                <div class="detail-row"><span class="detail-key">ENDPOINT</span><span class="detail-val">{inc['endpoint']}</span></div>
                <div class="detail-row"><span class="detail-key">STATUS CODE</span><span class="detail-val">{p['Status Code']}</span></div>
                <div class="detail-row"><span class="detail-key">RESP SIZE</span><span class="detail-val">{p['Response Size']} B</span></div>
                <div class="detail-row"><span class="detail-key">RISK SCORE</span>
                  <span class="detail-val" style="color:{inc['color']};">{inc['score']}/100</span></div>
              </div>
            </div>
            """, unsafe_allow_html=True)

            # Raw log
            st.markdown(f"""
            <div style="font-family:Share Tech Mono,monospace;font-size:11px;padding:14px 16px;
                 background:#141414;border:1px solid rgba(255,255,255,0.07);border-radius:4px;
                 color:rgba(255,255,255,0.55);word-break:break-all;line-height:1.8;margin-bottom:14px;">
              <div style="font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:3px;
                   margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.05);">
                   RAW LOG
              </div>
              {inc['raw']}
            </div>
            """, unsafe_allow_html=True)

            # Threat summary
            analysis_html = inc['analysis'].replace('\n', '<br/>')
            st.markdown(f"""
            <div class="threat-block {inc['cls']}">
              SOURCE_IP &nbsp; → {p['IP']}<br/>
              METHOD &nbsp;&nbsp;&nbsp;&nbsp; → {p['Request Method']}<br/>
              ENDPOINT &nbsp;&nbsp; → {inc['endpoint']}<span style="color:rgba(255,255,255,0.4);"> [{p['Status Code']}]</span><br/>
              RISK_SCORE &nbsp; → {inc['score']}/100 [{inc['level']}]<br/><br/>
              {analysis_html}
            </div>
            """, unsafe_allow_html=True)

            # Playbook
            steps_html = "".join(f"""
            <div class="playbook-step">
              <span class="step-num">{i:02d}</span><span>{step}</span>
            </div>""" for i, step in enumerate(inc["playbook"], 1))
            st.markdown(f'<div class="playbook-block">{steps_html}</div>', unsafe_allow_html=True)

# ─────────────────────────────────────────
# AUTO-REFRESH every 4 seconds
# ─────────────────────────────────────────
st.markdown("""
<script>
setTimeout(function(){ window.location.reload(); }, 3000);
</script>
""", unsafe_allow_html=True)