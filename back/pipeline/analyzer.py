def _ruleBasedAnalyzer(log: dict) -> int:
    score = 0
    endpoint = log["Request"].split()[0]

    method = log["Request Method"]
    status = log["Status Code"]
    userAgent = log["Client s/w info"].lower()

    if method in ["DELETE", "PUT"]:
        score += 30

    if "admin" in endpoint:
        score += 25

    if "login" in endpoint:
        score += 15

    if status >= 500:
        score += 10

    # sqlmap is a popular open source penetration testing tool 
    # that automates the process of detecting and exploiting SQL 
    # injection vulnerabilities in web applications.
    if "sqlmap" in userAgent:
        score += 80

    # why response time as a risk parameter?
    # typical backend response take max 1500 
    # and if it is taking more time, it may indicate that
    # attacker is triggering some kind of expensive operations on server 
    # to slow down the server
    if log["Request Processing Time"] > 2500:
        score += 5

    return score

import joblib
import pandas as pd

def _modelBasedAnalyzer(log: dict) -> int:
    model = joblib.load("models/isolationForest.pkl")
    scaler = joblib.load("models/scaler.pkl")

    endpoint = log["Request"].split()[0]

    METHOD_MAP = {
        "GET": 0,
        "POST": 1,
        "PUT": 2,
        "DELETE": 3,
        "PATCH": 4
    }

    method = METHOD_MAP.get(log["Request Method"], -1)

    feature_data = {
        "method": [method],
        "path_length": [len(endpoint)],
        "status": [log["Status Code"]],
        "response_size": [log["Response Size"]],
        "response_time": [log["Request Processing Time"]],
        "has_admin": [int("admin" in endpoint)],
        "has_login": [int("login" in endpoint)],
        "has_config": [int("config" in endpoint)],
        "is_error": [int(log["Status Code"] >= 400)],
    }

    X = pd.DataFrame(feature_data)

    if hasattr(scaler, "feature_names_in_"):
        X = X[list(scaler.feature_names_in_)]

    X_scaled = scaler.transform(X)
    iso_score = model.decision_function(X_scaled)[0]
    anomaly_risk = max(0, (0.5 - iso_score) * 100)

    return int(round(anomaly_risk))
 

def getRiskScore(log: dict) -> int:
    rule = _ruleBasedAnalyzer(log)
    model = _modelBasedAnalyzer(log)

    final_score = (0.7 * rule) + (0.3 * model)

    return round(final_score, 2)




# print(getRiskScore({
#     'IP': '173.79.77.52',
#     'Timestamp': '[27/Dec/2037:12:00:00 +0530]',
#     'Request Method': 'GET',
#     'Request': '/usr HTTP/1.0',
#     'Status Code': 200,
#     'Response Size': 5012,
#     'Client s/w info': 'Mozilla/5.0 (Android 10; Mobile; rv:84.0) Gecko/84.0 Firefox/84.0',
#     'Request Processing Time': 3330
# }))