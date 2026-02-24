import hashlib

# Trusted chunks registry
TRUSTED_CHUNKS = {}

def compute_hash(text: str):
    return hashlib.sha256(text.encode()).hexdigest()

def register_chunk(text: str):
    chunk_hash = compute_hash(text)
    TRUSTED_CHUNKS[chunk_hash] = text
    return chunk_hash

def is_trusted(text: str):
    chunk_hash = compute_hash(text)
    return chunk_hash in TRUSTED_CHUNKS