import type { ApiIncident, Incident } from "./types";

export function transform(api: ApiIncident, absIdx: number): Incident {
  const score = Math.round(api.risk_score);
  const level = score <= 30 ? "LOW" : score <= 60 ? "MEDIUM" : "HIGH";
  const color = level === "HIGH" ? "#ff4444" : level === "MEDIUM" ? "#ffaa00" : "#00cc55";
  const requestParts = api.parsed.Request.split(" ");
  const endpoint = requestParts[0] || "/";
  const method = api.parsed["Request Method"];
  const client = api.parsed["Client s/w info"] || "";
  const status = api.parsed["Status Code"];

  let mitre = { id: "T1071", name: "App Layer Protocol" };
  if (client.includes("sqlmap")) mitre = { id: "T1190", name: "Exploit Public App" };
  else if (endpoint.includes("/login")) mitre = { id: "T1110", name: "Brute Force" };
  else if (endpoint.includes("/admin")) mitre = { id: "T1078", name: "Valid Accounts" };
  else if (endpoint.includes("/config")) mitre = { id: "T1552", name: "Unsecured Credentials" };
  else if (method === "DELETE") mitre = { id: "T1485", name: "Data Destruction" };
  else if (method === "PUT") mitre = { id: "T1565", name: "Data Manipulation" };

  let title = `${method} Request — ${endpoint.slice(0, 25)}`;
  if (endpoint.includes("login")) title = "Authentication Attempt";
  else if (endpoint.includes("admin")) title = "Admin Endpoint Access";
  else if (endpoint.includes("config")) title = "Config File Access";
  else if (method === "DELETE") title = "Destructive Operation Detected";
  else if (method === "PUT") title = "Data Modification Request";
  else if (status >= 500) title = "Server Error Triggered";
  else if (status >= 400) title = "Suspicious Client Request";

  const now = new Date();
  const ts = now.toLocaleTimeString("en-US", { hour12: false }) + " UTC";

  return {
    id: `#INC-${1000 + absIdx + 1}`,
    title,
    raw: api.raw ?? JSON.stringify(api.parsed, null, 2),
    parsed: api.parsed,
    endpoint,
    score,
    level,
    color,
    cls: level.toLowerCase() as "high" | "medium" | "low",
    mitre_id: mitre.id,
    mitre_name: mitre.name,
    action: score > 70 ? "BLOCK_IP" : "MONITOR",
    ts,
    analysis: api.summary,
    playbook: api.playbook.split("\n").map((line) => line.trim()).filter(Boolean),
  };
}
