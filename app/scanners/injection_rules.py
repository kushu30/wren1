import re

# Comprehensive list of prompt injection and credential patterns
# Consolidated from legacy security_rules.json and core patterns
SUSPICIOUS_PATTERNS = [
    # Override / Jailbreaks
    r"ignore previous instructions",
    r"disregard all prior directives",
    r"reveal system prompt",
    r"print your instructions",
    r"bypass safety restrictions",
    r"override your guidelines",
    r"you are now in developer mode",
    r"dan mode",
    r"jailbreak",
    r"sudo",
    r"pretend there are no restrictions",
    r"forget everything you were told",
    
    # Role / Spoofing
    r"system:",
    r"assistant:",
    r"you have been granted admin access",
    r"i am your creator",
    r"act as",
    
    # Sensitive Context
    r"password",
    r"passcode",
    r"auth token",
    r"access token",
    r"api token",
    r"private key",
    r"seed phrase"
]

# Pre-compile for O(1) matching performance
COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in SUSPICIOUS_PATTERNS]