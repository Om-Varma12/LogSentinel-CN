from pipeline.analyzer import analyze
from services.log_generator import get_logs

def main():
    logs = get_logs
    
    for log in logs:
        analyze(log)
            
    