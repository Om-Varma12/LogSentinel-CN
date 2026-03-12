'''demo log:
173.79.77.52 - - [27/Dec/2037:12:00:00 +0530] "GET /usr HTTP/1.0" 200 5012 "-" "Mozilla/5.0 (Android 10; Mobile; rv:84.0) Gecko/84.0 Firefox/84.0" 3330

where, we want this parse function to return
IP: 173.79.77.52
Timestamp: [27/Dec/2037:12:00:00 +0530]
Request Method: GET
Request: /usr HTTP/1.0
Status Code: 200
Response Size: 5012 -> this is bytes
Client s/w info: Mozilla/5.0 (Android 10; Mobile; rv:84.0) Gecko/84.0 Firefox/84.0
Request Processing Time: 333   -> this is in ms
'''

import re

def parse(log: str) -> dict:
    pattern = r'(?P<ip>\S+) - - \[(?P<timestamp>[^\]]+)\] "(?P<method>\S+) (?P<request>[^\"]+)" (?P<status>\d+) (?P<size>\d+) "-" "(?P<client>[^"]+)" (?P<time>\d+)'

    match = re.match(pattern, log)

    if not match:
        return None

    data = match.groupdict()

    return {
        "IP": data["ip"],
        "Timestamp": f'[{data["timestamp"]}]',
        "Request Method": data["method"],
        "Request": data["request"],
        "Status Code": int(data["status"]),
        "Response Size": int(data["size"]),   # bytes
        "Client s/w info": data["client"],
        "Request Processing Time": int(data["time"])  # ms
    }
    
    
# from pprint import pprint    
# pprint(parse('173.79.77.52 - - [27/Dec/2037:12:00:00 +0530] "GET /usr HTTP/1.0" 200 5012 "-" "Mozilla/5.0 (Android 10; Mobile; rv:84.0) Gecko/84.0 Firefox/84.0" 3330'))