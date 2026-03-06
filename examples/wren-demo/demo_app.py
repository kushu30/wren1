from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from wren_gateway import WrenClient
import requests

app = FastAPI()

client = WrenClient(
    base_url="http://localhost:8000",
    api_key="4295f929b5b94f39787a7840e15909839f033f2461020ebd"
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        return client.chat(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": req.message}]
        )
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=403, detail=str(e))