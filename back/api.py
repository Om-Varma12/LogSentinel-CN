import asyncio
import json
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pipeline.run_pipeline import main as run_pipeline

RISK_THRESHOLD = 0

# Incidents that passed the threshold — replayed to clients that connect late
shared_incidents: list = []
pipeline_status: dict = {"running": False, "done": False}

# Flag to track if dashboard is actively viewing logs
dashboard_active: bool = False

# One asyncio.Queue per live WebSocket client
_active_queues: set = set()

# Captured once the event loop is running so the pipeline thread can post to it
_main_loop: asyncio.AbstractEventLoop | None = None


def _broadcast(msg: dict) -> None:
    """Schedule a push to every connected client (called inside the event loop)."""
    # Only broadcast incidents if dashboard is active; always broadcast control messages
    if msg["type"] != "incident" or dashboard_active:
        for q in list(_active_queues):
            q.put_nowait(msg)


def _on_incident(item: dict) -> None:
    """Pipeline thread callback — filters, stores, then broadcasts."""
    if item.get("risk_score", 0) <= RISK_THRESHOLD:
        return
    shared_incidents.append(item)
    _main_loop.call_soon_threadsafe(_broadcast, {"type": "incident", "data": item})


def _pipeline_runner() -> None:
    run_pipeline(on_incident=_on_incident, status=pipeline_status)
    _main_loop.call_soon_threadsafe(_broadcast, {"type": "done"})


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _main_loop
    _main_loop = asyncio.get_running_loop()
    threading.Thread(target=_pipeline_runner, daemon=True).start()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://log-sentinel-cn-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global dashboard_active
    await websocket.accept()

    # Snapshot existing incidents and register queue — no await between these
    # two lines so there is no race with the pipeline thread
    snapshot = list(shared_incidents) if dashboard_active else []
    q: asyncio.Queue = asyncio.Queue()
    _active_queues.add(q)

    try:
        # Replay incidents only if dashboard is already active
        for inc in snapshot:
            await websocket.send_json({"type": "incident", "data": inc})

        # Pipeline was already done before the client arrived
        if pipeline_status["done"]:
            await websocket.send_json({"type": "done"})
            return

        # Listen for control messages and stream live until pipeline signals done
        while True:
            # Check for client control messages (non-blocking)
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                control = json.loads(msg)
                
                if control.get("type") == "activate":
                    dashboard_active = True
                    # Replay all incidents when dashboard activates
                    for inc in shared_incidents:
                        await websocket.send_json({"type": "incident", "data": inc})
                    
            except asyncio.TimeoutError:
                pass  # No message; continue to check queue
            except Exception:
                break  # Client disconnected or invalid message

            # Check for pipeline messages
            try:
                msg = await asyncio.wait_for(q.get(), timeout=0.1)
                await websocket.send_json(msg)
                if msg["type"] == "done":
                    break
            except asyncio.TimeoutError:
                pass  # No message; loop continues

    except WebSocketDisconnect:
        pass
    finally:
        _active_queues.discard(q)
