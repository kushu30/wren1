from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import signup, login
from keys import generate_key, list_keys, delete_key
from db import get_conn
import uuid
import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuthBody(BaseModel):
    email: str
    password: str


@app.post("/auth/signup")
def signup_api(body: AuthBody):
    try:
        return signup(body.email, body.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/login")
def login_api(body: AuthBody):
    try:
        return login(body.email, body.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/auth/me")
def me(x_token: str = Header(None, alias="x-token")):
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT email,credits FROM users WHERE id=?",
            (x_token,)
        )

        row = cur.fetchone()

        if not row:
            return {"email": "", "credits": 0}

        return {
            "email": row[0],
            "credits": row[1]
        }
    finally:
        conn.close()


@app.get("/auth/api-keys")
def api_keys(x_token: str = Header(None, alias="x-token")):
    if not x_token:
        raise HTTPException(status_code=401, detail="Missing token")
    return list_keys(x_token)


@app.post("/auth/generate-key")
def generate_key_api(x_token: str = Header(None, alias="x-token")):
    if not x_token:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        return generate_key(x_token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/delete-key/{key_id}")
def delete_key_api(key_id: str, x_token: str = Header(None, alias="x-token")):
    if not x_token:
        raise HTTPException(status_code=401, detail="Missing token")
    return delete_key(x_token, key_id)


@app.post("/internal/log-event")
def log_event(user_id: str, module: str, severity: str, action: str, reason: str):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO security_events VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                str(uuid.uuid4()),
                user_id,
                module,
                severity,
                action,
                reason,
                datetime.datetime.utcnow().isoformat()
            )
        )

        conn.commit()
        return {"status": "ok"}
    finally:
        conn.close()


@app.post("/internal/verify-key")
def verify_key(x_wren_key: str = Header(None, alias="x-wren-key")):
    if not x_wren_key:
        raise HTTPException(status_code=401, detail="Missing key")
        
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT user_id FROM api_keys WHERE api_key=? AND active=1",
            (x_wren_key,)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid or inactive key")
            
        return {"tenant_id": row[0]}
    finally:
        conn.close()


@app.get("/auth/events")
def events(x_token: str = Header(None, alias="x-token")):
    if not x_token:
        raise HTTPException(status_code=401, detail="Missing token")
        
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT module,severity,action,reason,timestamp FROM security_events WHERE user_id=? ORDER BY timestamp DESC LIMIT 20",
            (x_token,)
        )

        rows = cur.fetchall()

        events_list = []

        for r in rows:
            events_list.append({
                "module": r[0],
                "severity": r[1],
                "action": r[2],
                "reason": r[3],
                "timestamp": r[4]
            })

        return events_list
    finally:
        conn.close()