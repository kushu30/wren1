from app.database import SessionLocal
from app.models.event import Event

def log_event(data: dict):
    db = SessionLocal()

    event = Event(
        tenant_id=data.get("tenant_id", "default"),
        module=data.get("module"),
        severity=data.get("risk"),
        action=data.get("action"),
        reason=data.get("reason"),
        session_id=data.get("session_id"),
        request_hash=data.get("request_hash"),
        ip_address=data.get("ip_address"),
    )

    db.add(event)
    db.commit()
    db.close()