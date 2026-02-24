import httpx
import json
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from .config import OPENAI_API_KEY, OPENAI_BASE_URL, MOCK_MODE
from .mock_llm import mock_chat_completion
from .scanners.input_scanner import scan_input
from .scanners.output_scanner import scan_output
from .policy_engine import policy_engine
from .logger.audit_logger import log_event


async def forward_request(request: Request):
    body = await request.json()
    policy = policy_engine.get()

    # -------- INPUT SCAN --------
    scan_result = scan_input(body)
    body = scan_result["modified_body"]

    # Injection detection
    if scan_result["is_injection"]:
        log_event({
            "module": "input",
            "risk": "high",
            "reason": scan_result["reason"],
            "action": "blocked" if policy.get("input", {}).get("block_on_injection") else "allowed"
        })

        if policy.get("input", {}).get("block_on_injection"):
            return JSONResponse(
                status_code=403,
                content={
                    "error": "Blocked by Wren",
                    "reason": scan_result["reason"]
                }
            )

    # PII redaction logging
    if scan_result["pii_found"]:
        log_event({
            "module": "input",
            "risk": "medium",
            "reason": f"PII detected: {scan_result['pii_found']}",
            "action": "redacted"
        })

    # -------- MOCK MODE --------
    if MOCK_MODE:
        response = await mock_chat_completion(body)
        response_body = response.body.decode()
        data = json.loads(response_body)

        message = data["choices"][0]["message"]

        # -------- RAG INTEGRITY CHECK --------
        if "rag_chunk" in message:
            from .rag.rag_scanner import scan_rag_chunk

            chunk = message["rag_chunk"]
            is_valid, reason = scan_rag_chunk(chunk)

            if not is_valid:
                log_event({
                    "module": "rag",
                    "risk": "high",
                    "reason": reason,
                    "action": "blocked"
                })

                return JSONResponse(
                    status_code=403,
                    content={
                        "error": "RAG integrity violation",
                        "reason": reason
                    }
                )

            log_event({
                "module": "rag",
                "risk": "low",
                "reason": "Document chunk verified",
                "action": "allowed"
            })

            message["content"] = f"[RAG VERIFIED]\n{chunk}"

        # -------- TOOL INTERCEPTION --------
        if "tool_calls" in message:
            tool_calls = message["tool_calls"]
            policy_tools = policy.get("tools") or {}
            allowed = policy_tools.get("allowed") or []
            blocked = policy_tools.get("blocked") or []

            for tool in tool_calls:
                tool_name = tool.get("name")

                if tool_name in blocked or tool_name not in allowed:
                    log_event({
                        "module": "tool",
                        "risk": "high",
                        "reason": f"Unauthorized tool call attempted: {tool_name}",
                        "action": "blocked"
                    })

                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "Tool call blocked by Wren",
                            "tool": tool_name
                        }
                    )

            log_event({
                "module": "tool",
                "risk": "low",
                "reason": f"Allowed tool call: {tool_name}",
                "action": "allowed"
            })

        # -------- OUTPUT SCAN --------
        if message.get("content"):
            redacted_content, findings = scan_output(message["content"])

            if findings:
                log_event({
                    "module": "output",
                    "risk": "high",
                    "reason": f"Sensitive data leaked: {findings}",
                    "action": "redacted"
                })

                message["content"] = redacted_content

        return JSONResponse(content=data)

    # -------- REAL LLM MODE --------
    headers = dict(request.headers)
    headers["Authorization"] = f"Bearer {OPENAI_API_KEY}"

    url = f"{OPENAI_BASE_URL}{request.url.path}"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            json=body,
            params=request.query_params
        )

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=dict(response.headers)
    )