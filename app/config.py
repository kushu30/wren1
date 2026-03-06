import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com")

MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"

WREN_API_KEYS = {
    "acme-secret-key",
    "demo-secret-key"
}