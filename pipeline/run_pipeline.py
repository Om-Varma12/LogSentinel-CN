import time
from pipeline.analyzer import getRiskScore
from pipeline.parser import parse
from services.log_generator import get_logs
from agents.summarizer_agent import summarize_log
from agents.playbook_agent import generate_playbook

def main(results: list = None, status: dict = None):
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

        if results is not None:
            results.append({
                "raw":        log.strip(),
                "parsed":     parsedLog,
                "risk_score": riskScore,
                "summary":    summary,
                "playbook":   playbook,
            })

        time.sleep(2)

    if status is not None:
        status["running"] = False
        status["done"] = True

if __name__ == "__main__":
    main()