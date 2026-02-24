from .pii_rules import EMAIL_REGEX, PHONE_REGEX, API_KEY_REGEX, CREDIT_CARD_REGEX

def scan_output(text: str):
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