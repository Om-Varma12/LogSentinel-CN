from pipeline.analyzer import getRiskScore
from pipeline.parser import parse
from services.log_generator import get_logs

def main():
    logs = get_logs()
    
    for log in logs:
        parsedLog = parse(log)
        riskScore = getRiskScore(log)