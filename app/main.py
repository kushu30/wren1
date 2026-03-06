from fastapi import FastAPI, Request, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, SessionLocal
from app.models.event import Event
from app.models.api_key import APIKey
from app.config import WREN_API_KEYS
from app.proxy import forward_request
from app.rag.registry import register_chunk
import secrets


app = FastAPI()

Event.metadata.create_all(bind=engine)
APIKey.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- AUTH MUST BE DEFINED BEFORE ROUTES --------
async def validate_wren_key(x_wren_key: str = Header(None)):
    if not x_wren_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = SessionLocal()

    api_key = db.query(APIKey).filter(APIKey.key == x_wren_key).first()

    db.close()

    if not api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return api_key


# -------- HEALTH --------
@app.get("/")
async def health():
    return {"status": "Wren running"}


# -------- EVENTS --------
@app.get("/events")
def get_events(api_key = Depends(validate_wren_key)):
    db = SessionLocal()

    events = (
        db.query(Event)
        .order_by(Event.timestamp.desc())
        .limit(100)
        .all()
    )

    result = []
    for e in events:
        result.append({
            "id": e.id,
            "timestamp": e.timestamp,
            "tenant_id": e.tenant_id,
            "session_id": e.session_id,
            "request_hash": e.request_hash,
            "ip_address": e.ip_address,
            "module": e.module,
            "severity": e.severity,
            "action": e.action,
            "reason": e.reason,
        })

    db.close()
    return {"events": result}


@app.post("/admin/create-key")
def create_api_key(tenant_id: str):
    db = SessionLocal()

    new_key = secrets.token_hex(24)

    api_key = APIKey(
        key=new_key,
        tenant_id=tenant_id
    )

    db.add(api_key)
    db.commit()
    db.close()

    return {
        "tenant_id": tenant_id,
        "api_key": new_key
    }


# -------- PROXY --------
@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(full_path: str, request: Request):
    return await forward_request(request)


register_chunk("Company policy: Always verify identity before sharing data.")