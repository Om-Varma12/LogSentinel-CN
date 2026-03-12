with open('resources/logfiles.log', 'r') as f:
    LOGS = f.readlines()[:10]

def get_logs():
    return LOGS
    
# get_logs()