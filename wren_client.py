import requests


class WrenClient:
    def __init__(self, base_url: str, wren_key: str):
        self.base_url = base_url
        self.wren_key = wren_key

    def chat(self, payload: dict):
        headers = {
            "Content-Type": "application/json",
            "X-Wren-Key": self.wren_key
        }

        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=60
        )

        return response.json()