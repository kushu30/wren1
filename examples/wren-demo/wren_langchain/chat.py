from typing import List, Optional
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from langchain_core.outputs import ChatGeneration, ChatResult
from wren_gateway import WrenClient
from pydantic import PrivateAttr


class WrenChat(BaseChatModel):
    wren_url: str
    api_key: str
    model: str = "gpt-4o-mini"

    _client: Optional[WrenClient] = PrivateAttr(default=None)

    @property
    def _llm_type(self) -> str:
        return "wren-chat"

    def _get_client(self) -> WrenClient:
        if self._client is None:
            self._client = WrenClient(
                base_url=self.wren_url,
                api_key=self.api_key,
            )
        return self._client

    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
    ):
        formatted_messages = []

        for m in messages:
            if isinstance(m, HumanMessage):
                formatted_messages.append({
                    "role": "user",
                    "content": m.content
                })
            else:
                formatted_messages.append({
                    "role": "assistant",
                    "content": m.content
                })

        client = self._get_client()

        resp = client.chat(messages=formatted_messages)

        if "error" in resp:
            text = f"Blocked by Wren: {resp['reason']}"
        else:
            text = resp["choices"][0]["message"]["content"]

        message = AIMessage(content=text)

        generation = ChatGeneration(message=message)

        return ChatResult(generations=[generation])