"""
model_loader.py — Singleton loader for the sentence-transformer model.

Loads once at first use and caches in a module-level variable.
If the model fails to load, returns None so the gateway continues.
"""

_model = None
_loaded = False


def load_model():
    """
    Load and cache the SentenceTransformer model.
    Returns the model instance, or None if loading fails.
    """
    global _model, _loaded

    if _loaded:
        return _model

    try:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        _loaded = True
    except Exception as e:
        print(f"[Wren Semantic] Model load failed: {e}")
        _model = None
        _loaded = True

    return _model
