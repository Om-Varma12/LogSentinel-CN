import time
from pipeline.analyzer import getRiskScore
from pipeline.parser import parse
from services.log_generator import get_logs
from agents.summarizer_agent import summarize_log
from agents.playbook_agent import generate_playbook

def main(on_incident=None, status: dict = None):
    if status is not None:
        status["running"] = True
        status["done"] = False

    logs = get_logs()
    for log in logs:
        parsedLog = parse(log)
        if parsedLog is None:
            continue

        riskScore = getRiskScore(parsedLog)
        summary = summarize_log(parsedLog, riskScore)
        playbook = generate_playbook(parsedLog, riskScore)

        if on_incident is not None:
            incident_data = {
                "raw":        log.strip(),
                "parsed":     parsedLog,
                "risk_score": riskScore,
                "summary":    summary,
                "playbook":   playbook,
            }
            print(f"[DEBUG] Incident data being sent to frontend:")
            print(f"  raw: {incident_data['raw'][:80]}...")
            print(f"  parsed: {incident_data['parsed']}")
            print(f"  risk_score: {incident_data['risk_score']}")
            print(f"  summary: {incident_data['summary'][:100]}...")
            print(f"  playbook: {incident_data['playbook'][:100]}...")
            print("---")
            on_incident(incident_data)

        time.sleep(5)

    if status is not None:
        status["running"] = False
        status["done"] = True

if __name__ == "__main__":
    main()