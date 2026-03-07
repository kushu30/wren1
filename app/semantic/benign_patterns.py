"""
benign_patterns.py — Baseline benign prompts for relative similarity comparison.

The detector compares incoming prompts against both attack AND benign patterns.
A prompt is only classified as an attack if it is more similar to attack patterns
than to these benign patterns.
"""

BENIGN_PATTERNS = [
    "tell me a joke",
    "summarize this article",
    "translate this sentence",
    "what is the capital of france",
    "explain how neural networks work",
    "write a python function to reverse a list",
    "give me a recipe for pasta",
    "what is machine learning",
    "explain the theory of relativity",
    "how do i center a div in css",
]
