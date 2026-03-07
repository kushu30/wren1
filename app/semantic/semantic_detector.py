"""
semantic_detector.py — Semantic prompt injection detection.

Delegates to the LLM-based intent classifier (Ollama / Llama3)
and converts the result into the standard detection format expected
by the rest of the gateway pipeline.
"""

from .intent_detector import detect_intent

# Intents that are treated as attacks
ATTACK_INTENTS = {"prompt_injection", "system_prompt_extraction", "tool_abuse"}


def detect_semantic_attack(text: str) -> dict:
    """
    Detect semantic prompt injection attacks using LLM intent classification.

    Parameters
    ----------
    text : str
        The raw user input to analyse.

    Returns
    -------
    dict with keys:
        is_attack  : bool   — whether the input is classified as an attack
        confidence : float  — model confidence (0.0–1.0)
        attack_type: str    — the classified intent or "model_error"
    """
    try:
        result = detect_intent(text)

        intent = result.get("intent", "benign")
        confidence = result.get("confidence", 0.0)

        if intent == "model_error":
            return {
                "is_attack": False,
                "confidence": 0.0,
                "attack_type": "model_error",
            }

        if intent in ATTACK_INTENTS:
            return {
                "is_attack": True,
                "confidence": round(confidence, 4),
                "attack_type": intent,
            }

        return {
            "is_attack": False,
            "confidence": round(confidence, 4),
            "attack_type": "benign",
        }

    except Exception as e:
        print(f"[Wren Semantic] Detection error: {e}")
        return {
            "is_attack": False,
            "confidence": 0.0,
            "attack_type": "model_error",
        }
