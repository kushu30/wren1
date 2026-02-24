import re

EMAIL_REGEX = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_REGEX = re.compile(r"\b\d{10}\b")
API_KEY_REGEX = re.compile(r"\bsk-[A-Za-z0-9]+\b")
CREDIT_CARD_REGEX = re.compile(r"\b\d{13,16}\b")