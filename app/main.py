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
import httpx

AUTH_API = "http://localhost:9000"


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

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{AUTH_API}/internal/verify-key",
                headers={"x-wren-key": x_wren_key},
                timeout=5.0
            )
        
        if resp.status_code != 200:
            print(f"DEBUG: Key verification failed with status {resp.status_code}")
            raise HTTPException(status_code=401, detail="Unauthorized")
            
        data = resp.json()
        
        # Return a mock object that has a tenant_id property to maintain compatibility
        class MockKey:
            def __init__(self, tenant_id):
                self.tenant_id = tenant_id
        
        return MockKey(data["tenant_id"])
    except Exception as e:
        print(f"DEBUG: Key validation error: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=401, detail="Unauthorized")


# -------- HEALTH --------
@app.get("/")
async def health():
    return {"status": "Wren running"}


# -------- EVENTS --------
@app.get("/events")
async def get_events(api_key = Depends(validate_wren_key)):
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
async def create_api_key(tenant_id: str):
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
async def proxy(full_path: str, request: Request, api_key = Depends(validate_wren_key)):
    request.state.tenant_id = api_key.tenant_id
    return await forward_request(request)


register_chunk("Company policy: Always verify identity before sharing data.")