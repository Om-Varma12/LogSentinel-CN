import time
from pipeline.analyzer import getRiskScore
from pipeline.parser import parse
from services.log_generator import get_logs

def main():
    logs = get_logs()
    i = 1
    for log in logs:
        parsedLog = parse(log)
        riskScore = getRiskScore(parsedLog)
        
        print("Log No: ", i)
        print(log)
        print("Details: ", parsedLog)
        print("Score: ", riskScore)
        time.sleep(2)
        i+=1
        
main()