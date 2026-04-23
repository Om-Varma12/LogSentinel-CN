export interface ApiIncident {
  raw?: string;
  risk_score: number;
  parsed: {
    IP: string;
    "Request Method": string;
    Request: string;
    "Status Code": number;
    "Response Size": number;
    Timestamp: string;
    "Client s/w info"?: string;
  };
  summary: string;
  playbook: string;
}

export interface ApiPipelineStatus {
  running: boolean;
  done: boolean;
}

export interface ApiIncidentsResponse {
  incidents: ApiIncident[];
  total: number;
  status: ApiPipelineStatus;
}

export interface Incident {
  id: string;
  title: string;
  raw: string;
  parsed: ApiIncident['parsed'];
  endpoint: string;
  score: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  color: string;
  cls: "high" | "medium" | "low";
  mitre_id: string;
  mitre_name: string;
  action: string;
  ts: string;
  analysis: string;
  playbook: string[];
}

export interface TerminalLine {
  text: string;
  style: "hi" | "lo" | "err" | "warn" | "ok";
}
