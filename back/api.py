import asyncio
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pipeline.run_pipeline import main as run_pipeline

RISK_THRESHOLD = 0

# Incidents that passed the threshold — replayed to clients that connect late
shared_incidents: list = []
pipeline_status: dict = {"running": False, "done": False}

# One asyncio.Queue per live WebSocket client
_active_queues: set = set()

# Captured once the event loop is running so the pipeline thread can post to it
_main_loop: asyncio.AbstractEventLoop | None = None


def _broadcast(msg: dict) -> None:
    """Schedule a push to every connected client (called inside the event loop)."""
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Snapshot existing incidents and register queue — no await between these
    # two lines so there is no race with the pipeline thread
    snapshot = list(shared_incidents)
    q: asyncio.Queue = asyncio.Queue()
    _active_queues.add(q)

    try:
        # Replay incidents already processed before this client connected
        for inc in snapshot:
            await websocket.send_json({"type": "incident", "data": inc})

        # Pipeline was already done before the client arrived
        if pipeline_status["done"]:
            await websocket.send_json({"type": "done"})
            return

        # Stream live until pipeline signals done
        while True:
            msg = await q.get()
            await websocket.send_json(msg)
            if msg["type"] == "done":
                break

    except WebSocketDisconnect:
        pass
    finally:
        _active_queues.discard(q)
