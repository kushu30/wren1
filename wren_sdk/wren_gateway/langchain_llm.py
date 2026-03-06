from langchain.llms.base import LLM
from typing import Optional, List, Mapping, Any
from wren_sdk.client import WrenClient


class WrenLLM(LLM):
    def __init__(self, base_url: str, api_key: str, model: str = "gpt-4o-mini"):
        super().__init__()
        self.client = WrenClient(base_url, api_key)
        self.model = model

    @property
    def _llm_type(self) -> str:
        return "wren-proxy"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        response = self.client.chat(
            messages=[{"role": "user", "content": prompt}],
            model=self.model
        )

        return response["choices"][0]["message"]["content"]

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        return {"model": self.model}