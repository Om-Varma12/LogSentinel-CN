import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pipeline.run_pipeline import main as run_pipeline

shared_incidents: list = []
pipeline_status: dict = {"running": False, "done": False}


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(
        target=run_pipeline,
        kwargs={"results": shared_incidents, "status": pipeline_status},
        daemon=True,
    )
    thread.start()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/incidents")
def get_incidents(since: int = 0):
    return {
        "incidents": shared_incidents[since:],
        "total": len(shared_incidents),
        "status": dict(pipeline_status),
    }


@app.get("/status")
def get_status():
    return dict(pipeline_status)
