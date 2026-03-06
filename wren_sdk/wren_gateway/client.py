import requests
import uuid


class WrenClient:
    def __init__(self, base_url: str, api_key: str, timeout: int = 60):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def chat(
        self,
        messages: list,
        model: str = "gpt-4o-mini",
        session_id: str = None,
        extra: dict = None,
    ):
        if session_id is None:
            session_id = str(uuid.uuid4())

        payload = {
            "model": model,
            "messages": messages
        }

        if extra:
            payload.update(extra)

        headers = {
            "Content-Type": "application/json",
            "X-Wren-Key": self.api_key,
            "X-Session-ID": session_id
        }

        try:
            response = requests.post(
                f"{self.base_url}/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=self.timeout
            )

            if response.status_code == 403:
                return response.json()

            response.raise_for_status()

            return response.json()

        except requests.exceptions.Timeout:
            raise Exception("Wren request timed out")

        except requests.exceptions.RequestException as e:
            raise Exception(f"Wren request failed: {str(e)}")

    def simple_chat(self, message: str, model: str = "gpt-4o-mini"):
        messages = [
            {"role": "user", "content": message}
        ]

        response = self.chat(messages=messages, model=model)

        if "choices" in response:
            return response["choices"][0]["message"]["content"]

        return response