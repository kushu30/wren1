import uuid
import datetime
from db import get_conn


def generate_key(user_id: str):
    conn = get_conn()
    try:
        # Check current credits and active key
        cur = conn.execute(
            "SELECT credits FROM users WHERE id=?",
            (user_id,)
        )
        user_row = cur.fetchone()
        if not user_row:
            raise Exception("User not found")
        
        credits = user_row[0]

        cur = conn.execute(
            "SELECT id FROM api_keys WHERE user_id=? AND active=1",
            (user_id,)
        )
        active_key = cur.fetchone()

        # Only allow new key if credits are 0 or no active key exists
        if credits > 0 and active_key:
            raise Exception(f"Cannot generate new key. You still have {credits} credits remaining.")

        # Deactivate all existing keys
        conn.execute(
            "UPDATE api_keys SET active=0 WHERE user_id=?",
            (user_id,)
        )

        # Generate new key
        api_key = "wren_sk_" + uuid.uuid4().hex
        key_id = str(uuid.uuid4())
        created = datetime.datetime.utcnow().isoformat()

        conn.execute(
            "INSERT INTO api_keys VALUES (?, ?, ?, ?, ?)",
            (key_id, user_id, api_key, 1, created)
        )

        # Reset credits to 100
        conn.execute(
            "UPDATE users SET credits=100 WHERE id=?",
            (user_id,)
        )

        conn.commit()

        return {
            "id": key_id,
            "api_key": api_key,
            "created_at": created,
            "credits": 100
        }
    finally:
        conn.close()


def list_keys(user_id: str):
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT id,api_key,created_at FROM api_keys WHERE user_id=? AND active=1",
            (user_id,)
        )

        row = cur.fetchone()

        if not row:
            return []

        return [{
            "id": row[0],
            "key": row[1],
            "created_at": row[2]
        }]
    finally:
        conn.close()


def delete_key(user_id: str, key_id: str):
    conn = get_conn()
    try:
        conn.execute(
            "UPDATE api_keys SET active=0 WHERE user_id=? AND id=?",
            (user_id, key_id)
        )
        conn.commit()
        return {"status": "ok"}
    finally:
        conn.close()