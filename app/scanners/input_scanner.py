from typing import Tuple
from .injection_rules import SUSPICIOUS_PATTERNS
from .pii_rules import EMAIL_REGEX, PHONE_REGEX, API_KEY_REGEX, CREDIT_CARD_REGEX

def detect_injection(text: str) -> Tuple[bool, str]:
    lower_text = text.lower()

    for pattern in SUSPICIOUS_PATTERNS:
        if pattern in lower_text:
            return True, f"Detected injection pattern: '{pattern}'"

    return False, "No injection detected"


def redact_pii(text: str):
    redacted = text
    findings = []

    if EMAIL_REGEX.search(redacted):
        redacted = EMAIL_REGEX.sub("[REDACTED_EMAIL]", redacted)
        findings.append("email")

    if PHONE_REGEX.search(redacted):
        redacted = PHONE_REGEX.sub("[REDACTED_PHONE]", redacted)
        findings.append("phone")

    if API_KEY_REGEX.search(redacted):
        redacted = API_KEY_REGEX.sub("[REDACTED_API_KEY]", redacted)
        findings.append("api_key")

    if CREDIT_CARD_REGEX.search(redacted):
        redacted = CREDIT_CARD_REGEX.sub("[REDACTED_CARD]", redacted)
        findings.append("credit_card")

    return redacted, findings


def scan_input(body: dict):
    messages = body.get("messages", [])
    combined_text = ""

    if not isinstance(messages, list):
        return {
            "is_injection": False,
            "reason": "Invalid messages format",
            "pii_found": [],
            "modified_body": body
        }

    for m in messages:
        if not isinstance(m, dict):
            continue

        if m.get("role") == "user":
            combined_text += m.get("content", "") + " "

    is_injection, reason = detect_injection(combined_text)

    redacted_text, pii_found = redact_pii(combined_text)

    if pii_found:
        for m in messages:
            if not isinstance(m, dict):
                continue

            if m.get("role") == "user":
                m["content"] = redact_pii(m.get("content", ""))[0]

    return {
        "is_injection": is_injection,
        "reason": reason,
        "pii_found": pii_found,
        "modified_body": body
    }