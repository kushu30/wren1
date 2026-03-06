from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    tenant_id = Column(String)
    session_id = Column(String)
    request_hash = Column(String)
    ip_address = Column(String)

    module = Column(String)
    severity = Column(String)
    action = Column(String)
    reason = Column(String)