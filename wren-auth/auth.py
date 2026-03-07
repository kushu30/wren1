import uuid
import datetime
from db import get_conn


def signup(email: str, password: str):
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT id FROM users WHERE email=?",
            (email,)
        )

        if cur.fetchone():
            raise Exception("User already exists")

        user_id = str(uuid.uuid4())
        credits = 100
        created = datetime.datetime.utcnow().isoformat()

        conn.execute(
            "INSERT INTO users VALUES (?, ?, ?, ?, ?)",
            (user_id, email, password, credits, created)
        )

        api_key = "wren_sk_" + uuid.uuid4().hex
        key_id = str(uuid.uuid4())

        conn.execute(
            "INSERT INTO api_keys VALUES (?, ?, ?, ?, ?)",
            (key_id, user_id, api_key, 1, created)
        )

        conn.commit()

        return {
            "token": user_id,
            "email": email,
            "api_key": api_key,
            "credits": credits
        }
    finally:
        conn.close()


def login(email: str, password: str):
    conn = get_conn()
    try:
        cur = conn.execute(
            "SELECT id,password FROM users WHERE email=?",
            (email,)
        )

        row = cur.fetchone()

        if not row:
            raise Exception("Invalid credentials")

        user_id = row[0]
        stored_password = row[1]

        if stored_password != password:
            raise Exception("Invalid credentials")

        return {
            "token": user_id,
            "email": email
        }
    finally:
        conn.close()