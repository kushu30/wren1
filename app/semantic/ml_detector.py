import re
import torch
import torch.nn.functional as F
from transformers import DistilBertTokenizerFast, AutoModelForSequenceClassification

# Load tokenizer and model once at module initialization
TOKENIZER_NAME = "distilbert-base-uncased"
MODEL_PATH = "prompt_injection_model"

print(f"[Wren ML] Loading DistilBERT model from {MODEL_PATH}...")
try:
    tokenizer = DistilBertTokenizerFast.from_pretrained(TOKENIZER_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval() # Set to evaluation mode
except Exception as e:
    print(f"[Wren ML] Failed to load model: {e}")
    tokenizer = None
    model = None


def normalize_prompt(text: str) -> str:
    """
    Removes politeness framing and question words to reveal raw intent.
    """
    if not text:
        return ""

    # 1. Lowercase
    text = text.lower()

    # 2. Remove leading politeness/framing phrases
    politeness_prefixes = [
        r"^could you\b",
        r"^can you\b",
        r"^would you\b",
        r"^please\b",
        r"^kindly\b",
        r"^for debugging purposes\b",
        r"^as a developer\b",
        r"^i was wondering if( you)?\b",
        r"^do you know if\b"
    ]

    while True:
        original_text = text
        for pattern in politeness_prefixes:
            text = re.sub(pattern, "", text).strip()
        if text == original_text:
            break

    # 3. Remove trailing question marks
    text = text.rstrip("?")

    # 4. Collapse extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def analyze_prompt(text: str) -> dict:
    """
    Runs the DistilBERT classifier on the normalized prompt.
    Returns categorized risk with scores.
    """
    if not model or not tokenizer:
        return {
            "category": "BENIGN",
            "scores": {"benign": 0.0, "attack": 0.0},
            "normalized_prompt": text,
            "error": "Model not loaded"
        }

    normalized = normalize_prompt(text)

    # Tokenize
    inputs = tokenizer(normalized, return_tensors="pt", truncation=True, padding=True, max_length=512)

    # Inference (no_grad for performance)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = F.softmax(logits, dim=1).squeeze().tolist()

    # Classes: 0 -> benign, 1 -> injection
    benign_score = probabilities[0]
    attack_score = probabilities[1]

    # Risk Categorization
    if attack_score >= 0.75:
        category = "ATTACK"
    elif attack_score >= 0.30:
        category = "SUSPICIOUS"
    else:
        category = "BENIGN"

    return {
        "category": category,
        "scores": {
            "benign": round(benign_score, 4),
            "attack": round(attack_score, 4)
        },
        "normalized_prompt": normalized
    }
