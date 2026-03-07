import os
from dotenv import load_dotenv
from wren_gateway import WrenClient

# Load configuration from .env
load_dotenv()

WREN_API_KEY = os.getenv("WREN_API_KEY")
WREN_BASE_URL = os.getenv("WREN_BASE_URL", "http://localhost:8000")

client = WrenClient(
    base_url=WREN_BASE_URL,
    api_key=WREN_API_KEY
)

response = client.chat(
    messages=[
        {"role": "user", "content": "Hello from Wren"}
    ]
)

print(response["choices"][0]["message"]["content"])
