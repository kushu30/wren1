from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pathlib import Path
import json
from .proxy import forward_request
from .rag.registry import register_chunk


app = FastAPI(title="Wren - LLM Security Proxy")

BASE_DIR = Path(__file__).resolve().parent.parent
LOG_FILE = BASE_DIR / "logs.json"


@app.get("/")
async def health():
    return {"status": "Wren running"}


@app.get("/logs")
async def get_logs():
    try:
        if not LOG_FILE.exists() or LOG_FILE.stat().st_size == 0:
            return {"logs": []}

        with open(LOG_FILE, "r") as f:
            data = json.load(f)

        return {"logs": data}

    except Exception as e:
        return {"error": str(e)}


@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(full_path: str, request: Request):
    try:
        return await forward_request(request)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    
register_chunk("Company policy: Always verify identity before sharing data.")