/**
 * Opens a WebSocket to the pipeline stream.
 * In dev the Vite proxy transparently forwards /ws → ws://localhost:8000/ws.
 */
export function createIncidentsSocket(): WebSocket {
  return new WebSocket(import.meta.env.VITE_WS_URL);
}