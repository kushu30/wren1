from typing import Tuple
from .injection_rules import COMPILED_PATTERNS
from .pii_rules import EMAIL_REGEX, PHONE_REGEX, API_KEY_REGEX, CREDIT_CARD_REGEX
from app.semantic.ml_detector import analyze_prompt
from app.logger.audit_logger import log_event

def detect_injection(text: str) -> Tuple[bool, str]:
    """
    Fast rule-based detection using pre-compiled regex.
    """
    for pattern in COMPILED_PATTERNS:
        if pattern.search(text):
            return True, f"Blocked: Identified high-risk pattern match"

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
        if isinstance(m, dict) and m.get("role") == "user":
            combined_text += m.get("content", "") + " "

    # --- ALWAYS Run ML-based detection first for scoring ---
    # This fulfills the 'every prompt gets a score' requirement
    ml_result = analyze_prompt(combined_text)
    ml_category = ml_result.get("category")

    # --- Rule-based detection (Standard Fast Layer) ---
    is_injection, reason = detect_injection(combined_text)

    # --- Combined Logic Flow ---
    if is_injection:
        # Rule-based block takes priority for speed
        log_event({
            "module": "rule_engine",
            "risk": "high",
            "action": "blocked",
            "reason": reason
        })
    elif ml_category == "ATTACK":
        # ML-based block
        is_injection = True
        reason = "ML prompt injection detected"
        log_event({
            "module": "ml_detector",
            "risk": "high",
            "action": "blocked",
            "reason": reason
        })
    elif ml_category == "SUSPICIOUS":
        # Log suspicion but allow
        log_event({
            "module": "ml_detector",
            "risk": "medium",
            "action": "allowed",
            "reason": f"ML detected {ml_category} activity (Score: {ml_result.get('scores', {}).get('attack', 0.0)})"
        })

    # --- Privacy Layer ---
    redacted_text, pii_found = redact_pii(combined_text)

    if pii_found:
        for m in messages:
            if isinstance(m, dict) and m.get("role") == "user":
                m["content"] = redact_pii(m.get("content", ""))[0]

    return {
        "is_injection": is_injection,
        "reason": reason,
        "pii_found": pii_found,
        "ml_result": ml_result,
        "modified_body": body
    }