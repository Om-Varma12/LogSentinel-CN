/**
 * Opens a WebSocket to the pipeline stream.
 * In dev the Vite proxy transparently forwards /ws → ws://localhost:8000/ws.
 */
export function createIncidentsSocket(): WebSocket {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  return new WebSocket(`${protocol}://${location.host}/ws`);
}
