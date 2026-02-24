from .registry import is_trusted
from ..scanners.input_scanner import detect_injection

def scan_rag_chunk(chunk: str):
    trusted = is_trusted(chunk)

    injection, reason = detect_injection(chunk)

    if not trusted:
        return False, "Untrusted document chunk detected"

    if injection:
        return False, f"Injection detected inside document: {reason}"

    return True, "Chunk verified"