import streamlit as st
import time
import random
import re

st.set_page_config(
    page_title="SENTINEL // AI Log Analyzer",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -------------------------
# Custom CSS — Cyberpunk Terminal Noir
# -------------------------

st.markdown("""
<style>

@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

/* === BASE RESET === */
html, body, [class*="css"] {
    font-family: 'Rajdhani', sans-serif;
    background-color: #020408 !important;
    color: #e8fff4 !important;
}

.stApp {
    background: #020408 !important;
    background-image:
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 140, 0.015) 2px,
            rgba(0, 255, 140, 0.015) 4px
        ) !important;
}

/* === SIDEBAR === */
[data-testid="stSidebar"] {
    background: #000d05 !important;
    border-right: 1px solid rgba(0, 255, 100, 0.15) !important;
}

[data-testid="stSidebar"] * {
    color: #88ffbb !important;
}

/* === SCROLLBAR === */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #020408; }
::-webkit-scrollbar-thumb { background: #00ff7f44; border-radius: 2px; }

/* === HEADER SECTION === */
.sentinel-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px 0 10px 0;
    border-bottom: 1px solid rgba(0,255,120,0.12);
    margin-bottom: 30px;
}

.sentinel-logo {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 900;
    color: #00ff7f;
    letter-spacing: 6px;
    text-transform: uppercase;
    opacity: 0.5;
}

.sentinel-title {
    font-family: 'Orbitron', monospace;
    font-size: 32px;
    font-weight: 900;
    color: #00ff7f;
    letter-spacing: 3px;
    text-shadow: 0 0 30px rgba(0,255,127,0.4), 0 0 60px rgba(0,255,127,0.15);
    line-height: 1;
}

.sentinel-subtitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: rgba(0,255,127,0.45);
    letter-spacing: 4px;
    margin-top: 4px;
}

/* === STATUS BADGE === */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border: 1px solid rgba(0,255,127,0.3);
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #00ff7f;
    letter-spacing: 2px;
    background: rgba(0,255,127,0.05);
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ff7f;
    animation: pulse-dot 2s ease-in-out infinite;
    box-shadow: 0 0 6px #00ff7f;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
}

/* === STAGE CARDS === */
.stage-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 20px 0;
}

.stage-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border: 1px solid rgba(0,255,127,0.08);
    border-left: 3px solid rgba(0,255,127,0.08);
    border-radius: 2px;
    background: rgba(0, 255, 127, 0.02);
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: rgba(0,255,127,0.55);
    letter-spacing: 1px;
    transition: all 0.4s ease;
}

.stage-item.active {
    border-left: 3px solid #00ff7f;
    background: rgba(0, 255, 127, 0.06);
    color: #00ff7f;
    box-shadow: inset 0 0 20px rgba(0,255,127,0.04), 0 0 15px rgba(0,255,127,0.08);
}

.stage-item.done {
    border-left: 3px solid rgba(0,255,127,0.6);
    color: rgba(0,255,127,0.7);
}

.stage-num {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 7px;
    border: 1px solid currentColor;
    border-radius: 2px;
    min-width: 28px;
    text-align: center;
}

.stage-spinner {
    display: inline-block;
    animation: spin-char 0.5s steps(4, end) infinite;
}

@keyframes spin-char {
    0%   { content: "⠋"; }
}

/* === METRIC CARDS === */
.metric-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.metric-card {
    padding: 18px 20px;
    border: 1px solid rgba(0,255,127,0.1);
    border-radius: 2px;
    background: rgba(0, 20, 10, 0.6);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,127,0.4), transparent);
}

.metric-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: rgba(0,255,127,0.65);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.metric-value {
    font-family: 'Orbitron', monospace;
    font-size: 28px;
    font-weight: 700;
    color: #00ff7f;
    text-shadow: 0 0 20px rgba(0,255,127,0.4);
    line-height: 1;
}

.metric-value.danger {
    color: #ff4444;
    text-shadow: 0 0 20px rgba(255,68,68,0.5);
}

.metric-value.warn {
    color: #ffaa00;
    text-shadow: 0 0 20px rgba(255,170,0,0.4);
}

/* === LOG DISPLAY === */
.log-raw {
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    padding: 20px;
    background: #000d05;
    border: 1px solid rgba(0,255,127,0.1);
    border-radius: 2px;
    color: #80ffb8;
    word-break: break-all;
    position: relative;
    overflow: hidden;
}

.log-raw::before {
    content: '> LIVE_INPUT';
    display: block;
    font-size: 9px;
    color: rgba(0,255,127,0.3);
    letter-spacing: 3px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0,255,127,0.08);
}

/* === PARSED TABLE === */
.parsed-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.parsed-row {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    background: rgba(0,255,127,0.03);
    border-left: 2px solid rgba(0,255,127,0.15);
}

.parsed-key {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: rgba(0,255,127,0.6);
    letter-spacing: 2px;
    min-width: 80px;
    text-transform: uppercase;
    padding-top: 2px;
}

.parsed-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: #afffcc;
    font-weight: 600;
}

/* === RISK GAUGE === */
.risk-wrapper {
    text-align: center;
    padding: 20px;
}

.risk-bar-track {
    height: 8px;
    background: rgba(0,255,127,0.08);
    border-radius: 4px;
    border: 1px solid rgba(0,255,127,0.1);
    overflow: hidden;
    position: relative;
    margin: 12px 0;
}

.risk-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
}

.risk-bar-fill::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 20px;
    background: rgba(255,255,255,0.3);
    filter: blur(4px);
}

.risk-score-num {
    font-family: 'Orbitron', monospace;
    font-size: 48px;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 4px;
}

.risk-label-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: 0.7;
}

/* === THREAT SUMMARY === */
.threat-block {
    padding: 20px;
    border: 1px solid rgba(255,80,80,0.2);
    border-left: 4px solid #ff4444;
    background: rgba(255, 0, 0, 0.04);
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    line-height: 2.1;
    color: #ffcccc;
    font-weight: 600;
    position: relative;
}

.threat-block::before {
    content: '// THREAT_ANALYSIS';
    display: block;
    font-size: 9px;
    color: rgba(255,68,68,0.5);
    letter-spacing: 3px;
    margin-bottom: 12px;
}

.threat-block.low {
    border-left: 4px solid #00ff7f;
    border-color: rgba(0,255,127,0.2);
    background: rgba(0,255,127,0.03);
    color: #ccffe6;
    font-weight: 600;
}
.threat-block.low::before { color: rgba(0,255,127,0.5); }

.threat-block.medium {
    border-left: 4px solid #ffaa00;
    border-color: rgba(255,170,0,0.2);
    background: rgba(255,170,0,0.04);
    color: #ffe0a0;
    font-weight: 600;
}
.threat-block.medium::before { color: rgba(255,170,0,0.5); }

/* === PLAYBOOK === */
.playbook-block {
    padding: 20px;
    border: 1px solid rgba(0,170,255,0.2);
    border-left: 4px solid #00aaff;
    background: rgba(0, 140, 255, 0.04);
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    line-height: 2.1;
    color: #cceeff;
    font-weight: 600;
    position: relative;
}

.playbook-block::before {
    content: '// RESPONSE_PLAYBOOK';
    display: block;
    font-size: 9px;
    color: rgba(0,170,255,0.5);
    letter-spacing: 3px;
    margin-bottom: 12px;
}

.playbook-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(0,170,255,0.06);
}

.step-num {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    padding: 2px 6px;
    border: 1px solid rgba(0,170,255,0.3);
    color: #00aaff;
    border-radius: 2px;
    min-width: 28px;
    text-align: center;
    margin-top: 2px;
}

/* === SECTION HEADERS === */
.section-header {
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 700;
    color: rgba(0,255,127,0.75);
    letter-spacing: 5px;
    text-transform: uppercase;
    margin: 24px 0 12px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-header::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,255,127,0.2), transparent);
}

/* === SIDEBAR LOGS === */
.sidebar-log-item {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    padding: 8px 10px;
    margin-bottom: 4px;
    border-left: 2px solid rgba(0,255,127,0.25);
    background: rgba(0,255,127,0.03);
    color: rgba(0,255,127,0.65);
    word-break: break-all;
    line-height: 1.6;
    border-radius: 0 2px 2px 0;
}

.sidebar-log-item.active {
    border-left: 2px solid #00ff7f;
    background: rgba(0,255,127,0.08);
    color: #afffcc;
}

/* === BUTTON === */
.stButton > button {
    font-family: 'Orbitron', monospace !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 3px !important;
    color: #00ff7f !important;
    background: transparent !important;
    border: 1px solid rgba(0,255,127,0.4) !important;
    padding: 14px 36px !important;
    border-radius: 2px !important;
    text-transform: uppercase !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 0 20px rgba(0,255,127,0.08) !important;
    position: relative !important;
    overflow: hidden !important;
}

.stButton > button:hover {
    background: rgba(0,255,127,0.08) !important;
    border-color: rgba(0,255,127,0.8) !important;
    box-shadow: 0 0 30px rgba(0,255,127,0.2), inset 0 0 20px rgba(0,255,127,0.05) !important;
}

.stButton > button:active {
    transform: scale(0.98) !important;
}

/* === DIVIDERS === */
hr {
    border: none !important;
    border-top: 1px solid rgba(0,255,127,0.08) !important;
    margin: 20px 0 !important;
}

/* === SPINNER OVERRIDE === */
.stSpinner > div {
    border-top-color: #00ff7f !important;
}

/* === HIDE DEFAULT STREAMLIT ELEMENTS === */
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
header { visibility: hidden; }
.block-container { padding-top: 20px !important; }

/* === SCAN LINE ANIMATION === */
@keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
}

.scanline-overlay {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(transparent, rgba(0,255,127,0.04), transparent);
    pointer-events: none;
    z-index: 9999;
    animation: scanline 6s linear infinite;
}

/* === TYPEWRITER === */
@keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink-cursor {
    0%, 100% { border-right-color: #00ff7f; }
    50% { border-right-color: transparent; }
}

/* === GLITCH === */
@keyframes glitch {
    0%, 100% { text-shadow: 0 0 30px rgba(0,255,127,0.4); transform: translate(0); }
    20% { text-shadow: -2px 0 rgba(255,0,80,0.5), 2px 0 rgba(0,255,255,0.5); transform: translate(-1px, 0); }
    40% { text-shadow: 2px 0 rgba(255,0,80,0.5), -2px 0 rgba(0,255,255,0.5); transform: translate(1px, 0); }
    60% { text-shadow: 0 0 30px rgba(0,255,127,0.4); transform: translate(0); }
}

.glitch-text {
    animation: glitch 5s ease-in-out infinite;
}

</style>

<div class='scanline-overlay'></div>
""", unsafe_allow_html=True)

# -------------------------
# Demo Logs (single log pool)
# -------------------------

logs = [
    "2026-03-12T18:10:22Z server-01 auth INFO EVENT_ID=1001 SRC_IP=192.168.1.45 USER=john ACTION=login STATUS=success MESSAGE='User john logged in successfully'",
    "2026-03-12T18:12:11Z server-01 auth WARN EVENT_ID=1002 SRC_IP=192.168.1.88 USER=admin ACTION=login STATUS=failed MESSAGE='Failed login attempt for admin account'",
    "2026-03-12T18:13:40Z server-01 auth ERROR EVENT_ID=1003 SRC_IP=192.168.1.88 USER=admin ACTION=login STATUS=failed MESSAGE='Multiple failed login attempts detected'",
    "2026-03-12T18:18:55Z firewall-01 network ALERT EVENT_ID=3001 SRC_IP=10.0.0.5 USER=unknown ACTION=port_scan STATUS=blocked MESSAGE='Port scan detected targeting multiple ports'",
    "2026-03-12T18:20:33Z firewall-01 network CRITICAL EVENT_ID=3002 SRC_IP=172.16.0.7 USER=system ACTION=data_transfer STATUS=allowed MESSAGE='Large outbound traffic to unknown external server'"
]

# -------------------------
# Parser
# -------------------------

def parse_log(log):
    pattern = r'(\S+) (\S+) (\S+) (\S+) EVENT_ID=(\d+) SRC_IP=(\S+) USER=(\S+) ACTION=(\S+) STATUS=(\S+)'
    match = re.search(pattern, log)
    if match:
        return {
            "timestamp": match.group(1),
            "host": match.group(2),
            "service": match.group(3),
            "level": match.group(4),
            "event_id": match.group(5),
            "src_ip": match.group(6),
            "user": match.group(7),
            "action": match.group(8),
            "status": match.group(9)
        }
    return None

# -------------------------
# Risk Engine
# -------------------------

def calculate_risk(log):
    score = 0
    if "failed" in log: score += 15
    if "port_scan" in log: score += 40
    if "data_transfer" in log: score += 35
    if "CRITICAL" in log: score += 25
    if "ERROR" in log: score += 20
    if "ALERT" in log: score += 30
    if "WARN" in log: score += 10
    return min(score, 100)

def risk_level(score):
    if score <= 20: return "LOW", "#00ff7f", "low"
    if score <= 55: return "MEDIUM", "#ffaa00", "medium"
    return "HIGH", "#ff4444", "high"

def risk_color_bar(score):
    if score <= 3: return "linear-gradient(90deg, #00ff7f, #00cc60)"
    if score <= 9: return "linear-gradient(90deg, #ffaa00, #ff6600)"
    return "linear-gradient(90deg, #ff4444, #cc0000)"

# -------------------------
# SIDEBAR
# -------------------------

st.sidebar.markdown("""
<div style='font-family: Orbitron, monospace; font-size: 10px; color: #00ff7f;
     letter-spacing: 4px; text-transform: uppercase; padding: 10px 0 20px 0;
     border-bottom: 1px solid rgba(0,255,127,0.15); margin-bottom: 16px;'>
     SENTINEL<br/>
     <span style='font-size:8px; opacity:0.4; letter-spacing:3px;'>LOG STREAM MONITOR</span>
</div>
""", unsafe_allow_html=True)

sidebar_header = st.sidebar.empty()
sidebar_log_display = st.sidebar.empty()



# -------------------------
# MAIN HEADER
# -------------------------

st.markdown("""
<div class='sentinel-header'>
    <div>
        <div class='sentinel-logo'>SENTINEL SYSTEMS v2.4.1</div>
        <div class='sentinel-title glitch-text'>AI LOG ANALYZER</div>
        <div class='sentinel-subtitle'>REAL-TIME THREAT INTELLIGENCE PLATFORM</div>
    </div>
    <div style='margin-left: auto;'>
        <div class='status-badge'>
            <div class='status-dot'></div>
            SYSTEM ONLINE
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# -------------------------
# TOP METRICS + START BUTTON
# -------------------------

m1, m2, m3, m4 = st.columns([1, 1, 1, 2])

total_box = m1.empty()
risk_box = m2.empty()
level_box = m3.empty()

with m4:
    start = st.button("⟩  INITIALIZE SCAN")

def render_metrics(total, risk_score, level_str, level_color):
    total_box.markdown(f"""
    <div class='metric-card'>
        <div class='metric-label'>LOGS PROCESSED</div>
        <div class='metric-value'>{total:03d}</div>
    </div>
    """, unsafe_allow_html=True)

    risk_box.markdown(f"""
    <div class='metric-card'>
        <div class='metric-label'>RISK SCORE</div>
        <div class='metric-value' style='color:{level_color}; text-shadow: 0 0 20px {level_color}66;'>{risk_score}/100</div>
    </div>
    """, unsafe_allow_html=True)

    level_box.markdown(f"""
    <div class='metric-card'>
        <div class='metric-label'>THREAT LEVEL</div>
        <div class='metric-value' style='font-size:22px; color:{level_color}; text-shadow: 0 0 20px {level_color}66;'>{level_str}</div>
    </div>
    """, unsafe_allow_html=True)

render_metrics(0, 0, "IDLE", "rgba(0,255,127,0.4)")

# -------------------------
# LAYOUT — two main columns
# left: pipeline stages   right: live terminal
# -------------------------

main_left, main_right = st.columns([1, 1])

with main_left:
    st.markdown("<div class='section-header'>PIPELINE STAGES</div>", unsafe_allow_html=True)
    stages_box = st.empty()

with main_right:
    st.markdown("<div class='section-header' style='margin-bottom: 32px;'>LIVE TERMINAL FEED</div>", unsafe_allow_html=True)
    terminal_box = main_right.empty()

# second row — parsed fields + risk analysis
st.markdown("<div class='section-header'>INGESTED LOG</div>", unsafe_allow_html=True)
log_display = st.empty()

col_left, col_right = st.columns([1, 1])

with col_left:
    st.markdown("<div class='section-header'>PARSED FIELDS</div>", unsafe_allow_html=True)
    parsed_display = col_left.empty()

with col_right:
    st.markdown("<div class='section-header'>RISK ANALYSIS</div>", unsafe_allow_html=True)
    risk_display = col_right.empty()

st.markdown("<div class='section-header'>THREAT SUMMARY</div>", unsafe_allow_html=True)
summary_display = st.empty()

st.markdown("<div class='section-header'>RESPONSE PLAYBOOK</div>", unsafe_allow_html=True)
playbook_display = st.empty()

# -------------------------
# STAGE RENDERER
# -------------------------

def render_stages(active_stage):
    stage_defs = [
        ("01", "LOG INGESTION",    "Capturing raw log stream from data source"),
        ("02", "PARSE & TOKENIZE", "Extracting structured fields from log entry"),
        ("03", "RISK SCORING",     "Calculating threat severity via heuristic engine"),
        ("04", "AI SYNTHESIS",     "Generating natural-language threat summary"),
        ("05", "PLAYBOOK GEN",     "Compiling incident response recommendations"),
    ]
    html = "<div class='stage-container'>"
    for i, (num, title, desc) in enumerate(stage_defs):
        stage_idx = i + 1
        if stage_idx < active_stage:
            cls, indicator = "done", "✓"
        elif stage_idx == active_stage:
            cls, indicator = "active", "⟳"
        else:
            cls, indicator = "", "○"
        html += f"""
        <div class='stage-item {cls}'>
            <span class='stage-num'>{indicator}</span>
            <div>
                <div style='font-size:14px; letter-spacing:2px; font-weight:700;'>{title}</div>
                <div style='font-size:12px; opacity:0.7; margin-top:3px;'>{desc}</div>
            </div>
        </div>"""
    html += "</div>"
    stages_box.markdown(html, unsafe_allow_html=True)

# -------------------------
# TERMINAL RENDERER
# -------------------------

terminal_lines = []

def render_terminal(new_line=None, highlight=False):
    global terminal_lines
    if new_line:
        terminal_lines.append((new_line, highlight))

    rows = ""
    for i, (line, hl) in enumerate(terminal_lines):
        color = "#00ff7f" if hl else "rgba(0,255,127,0.55)"
        glow  = f"text-shadow: 0 0 8px rgba(0,255,127,0.5);" if hl else ""
        rows += f"<div style='color:{color}; {glow} margin-bottom:5px; font-size:13px;'>{line}</div>"

    # blinking cursor on last line
    rows += "<div style='color:#00ff7f; animation: pulse-dot 1s infinite;'>█</div>"

    terminal_box.markdown(f"""
    <div style='
        font-family: Share Tech Mono, monospace;
        background: #000c04;
        border: 1px solid rgba(0,255,127,0.15);
        border-radius: 2px;
        padding: 16px 18px;
        min-height: 420px;
        max-height: 320px;
        overflow-y: auto;
        position: relative;
    '>
        <div style='font-size:10px; color:rgba(0,255,127,0.4); letter-spacing:3px;
             margin-bottom:12px; padding-bottom:8px;
             border-bottom:1px solid rgba(0,255,127,0.08);
             display:flex; justify-content:space-between;'>
            <span>SENTINEL:// TERMINAL</span>
            <span style='animation: pulse-dot 2s infinite;'>● LIVE</span>
        </div>
        {rows}
    </div>
    """, unsafe_allow_html=True)

render_stages(0)
render_terminal()

# -------------------------
# SIMULATION
# -------------------------

if start:
    terminal_lines = []          # reset terminal on each run
    log = random.choice(logs)

    # Sidebar
    sidebar_header.markdown("""
    <div style='font-family: Share Tech Mono, monospace; font-size: 11px;
         color: rgba(0,255,127,0.6); letter-spacing: 2px; margin-bottom: 8px;'>
         ACTIVE LOG ENTRY:
    </div>
    """, unsafe_allow_html=True)
    sidebar_log_display.markdown(f"""
    <div class='sidebar-log-item active'>{log}</div>
    """, unsafe_allow_html=True)

    # === STAGE 1: INGEST ===
    render_stages(1)
    render_terminal("[SYS]  Initialising log ingestion pipeline...", highlight=False)
    time.sleep(1)
    render_terminal("[SYS]  Stream connection established.", highlight=False)
    time.sleep(0.8)
    render_terminal(f"[IN]   Raw log captured ↓", highlight=True)
    time.sleep(0.6)
    render_terminal(f"[DATA] {log[:80]}{'...' if len(log)>80 else ''}", highlight=True)
    log_display.markdown(f"<div class='log-raw'>{log}</div>", unsafe_allow_html=True)
    time.sleep(2)

    # === STAGE 2: PARSE ===
    render_stages(2)
    render_terminal("[SYS]  Starting tokenizer / field extractor...", highlight=False)
    time.sleep(0.8)
    parsed = parse_log(log)
    if parsed:
        for k, v in parsed.items():
            render_terminal(f"[FLD]  {k.upper():<12} → {v}", highlight=False)
            time.sleep(0.25)
        rows_html = "".join(f"""
            <div class='parsed-row'>
                <span class='parsed-key'>{k}</span>
                <span class='parsed-val'>{v}</span>
            </div>""" for k, v in parsed.items())
        parsed_display.markdown(f"<div class='parsed-grid'>{rows_html}</div>", unsafe_allow_html=True)
    render_terminal("[OK]   Parsing complete — 9 fields extracted.", highlight=True)
    time.sleep(2)

    # === STAGE 3: RISK ===
    render_stages(3)
    render_terminal("[SYS]  Running heuristic risk scoring engine...", highlight=False)
    time.sleep(0.8)
    risk_score = calculate_risk(log)
    level_str, level_color, level_cls = risk_level(risk_score)
    bar_pct = int((risk_score / 100) * 100)
    bar_grad = risk_color_bar(risk_score)

    render_terminal(f"[RISK] Score computed: {risk_score}/100", highlight=False)
    time.sleep(0.5)
    render_terminal(f"[RISK] Threat level  : {level_str}", highlight=True)
    time.sleep(0.5)

    risk_display.markdown(f"""
    <div style='padding: 20px; border: 1px solid {level_color}33; border-radius: 2px;
         background: {level_color}08;'>
        <div class='risk-wrapper'>
            <div class='risk-score-num' style='color:{level_color};
                 text-shadow: 0 0 30px {level_color}55;'>{risk_score}</div>
            <div class='risk-label-text' style='color:{level_color}; font-size:14px;'>/ 100 — {level_str} THREAT</div>
            <div class='risk-bar-track' style='margin-top: 16px;'>
                <div class='risk-bar-fill' style='width:{bar_pct}%; background:{bar_grad};'></div>
            </div>
            <div style='display:flex; justify-content:space-between;
                 font-family: Share Tech Mono, monospace; font-size:12px;
                 color: rgba(0,255,127,0.5); letter-spacing: 2px; margin-top: 6px;'>
                <span>LOW</span><span>MEDIUM</span><span>CRITICAL</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    render_metrics(1, risk_score, level_str, level_color)
    time.sleep(2)

    # === STAGE 4: SUMMARY ===
    render_stages(4)
    render_terminal("[AI]   Generating threat intelligence summary...", highlight=False)
    time.sleep(1.2)

    action   = parsed['action']   if parsed else 'unknown'
    src_ip   = parsed['src_ip']   if parsed else 'unknown'
    user     = parsed['user']     if parsed else 'unknown'
    status   = parsed['status']   if parsed else 'unknown'
    host     = parsed['host']     if parsed else 'unknown'
    event_id = parsed['event_id'] if parsed else 'N/A'

    render_terminal(f"[AI]   Event {event_id}: {action.upper()} from {src_ip}", highlight=True)
    time.sleep(0.5)
    render_terminal(f"[AI]   Classification: {level_str} THREAT", highlight=True)

    summary_display.markdown(f"""
    <div class='threat-block {level_cls}'>
        EVENT_ID &nbsp;&nbsp;&nbsp; → {event_id}<br/>
        ACTION &nbsp;&nbsp;&nbsp;&nbsp; → {action.upper()}<br/>
        SOURCE_IP &nbsp;&nbsp; → {src_ip}<br/>
        USER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → {user}<br/>
        HOST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → {host}<br/>
        STATUS &nbsp;&nbsp;&nbsp;&nbsp; → {status.upper()}<br/>
        RISK_SCORE &nbsp; → {risk_score}/100 [{level_str}]<br/>
        <br/>
        ANALYSIS &nbsp;&nbsp; → Suspicious {action.replace('_',' ')} activity detected from
        {src_ip}. Threat classification: {level_str}. Immediate review recommended
        {'if pattern persists.' if risk_score < 10 else 'and containment advised.'}
    </div>
    """, unsafe_allow_html=True)
    time.sleep(2)

    # === STAGE 5: PLAYBOOK ===
    render_stages(5)
    render_terminal("[PB]   Building incident response playbook...", highlight=False)
    time.sleep(1)

    playbook_steps = [
        f"Isolate source IP {src_ip} and cross-reference against threat intel feeds",
        f"Review all recent activity from user '{user}' across authentication logs",
        f"{'Block' if risk_score >= 10 else 'Monitor'} {src_ip} at perimeter firewall {'immediately' if risk_score >= 10 else 'for next 24h'}",
        "Escalate to Tier-2 SOC analyst if additional events from same source",
        "Document incident in SIEM and update threat actor profile if applicable",
    ]

    steps_html = ""
    for i, step in enumerate(playbook_steps, 1):
        render_terminal(f"[PB]   Step {i:02d}: {step[:55]}{'...' if len(step)>55 else ''}", highlight=False)
        steps_html += f"""
        <div class='playbook-step'>
            <span class='step-num'>{i:02d}</span>
            <span>{step}</span>
        </div>"""
        time.sleep(0.4)

    playbook_display.markdown(f"<div class='playbook-block'>{steps_html}</div>", unsafe_allow_html=True)

    render_stages(6)
    render_terminal("[DONE] ── Analysis pipeline complete ──", highlight=True)
    time.sleep(1)

    st.markdown(f"""
    <div style='margin-top: 20px; padding: 16px 22px;
         border: 1px solid {level_color}33; border-radius: 2px;
         background: {level_color}06; display: flex; align-items: center; gap: 14px;'>
        <div style='width: 10px; height: 10px; border-radius: 50%;
             background: {level_color}; box-shadow: 0 0 12px {level_color};
             animation: pulse-dot 1.5s ease-in-out infinite; flex-shrink:0;'></div>
        <span style='font-family: Share Tech Mono, monospace; font-size: 14px;
              color: {level_color}; letter-spacing: 2px; font-weight:600;'>
            ANALYSIS COMPLETE &nbsp;·&nbsp; THREAT LEVEL: {level_str} &nbsp;·&nbsp; RISK SCORE: {risk_score}/100
        </span>
    </div>
    """, unsafe_allow_html=True)