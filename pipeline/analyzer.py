def ruleBasedAnalyzer(log: dict) -> int:
    score = 0
    endpoint = log["Request"].split()[0]

    method = log["Request Method"]
    status = log["Status Code"]
    ua = log["Client s/w info"].lower()

    if method in ["DELETE", "PUT"]:
        score += 30

    if "admin" in endpoint:
        score += 25

    if "login" in endpoint:
        score += 15

    if status >= 500:
        score += 10

    if "sqlmap" in ua:
        score += 80

    # why response time as a risk parameter?
    # typical backend response take max 1500 
    # and if it is taking more time, it may indicate that
    # attacker is triggers some kind of expensive operations on server 
    # to slow down the server
    if log["Request Processing Time"] > 2500:
        score += 5

    return score


print(ruleBasedAnalyzer({
    'IP': '173.79.77.52',
    'Timestamp': '[27/Dec/2037:12:00:00 +0530]',
    'Request Method': 'GET',
    'Request': '/usr HTTP/1.0',
    'Status Code': 200,
    'Response Size': 5012,
    'Client s/w info': 'Mozilla/5.0 (Android 10; Mobile; rv:84.0) Gecko/84.0 Firefox/84.0',
    'Request Processing Time': 3330
}))

def modelBasedAnalyzer(log: dict) -> int:
    pass