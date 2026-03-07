import yaml
from pathlib import Path

POLICY_PATH = Path("policy.yaml")

def load_policy():
    if not POLICY_PATH.exists():
        # Fallback default policy if file is missing
        return {
            "input": {"block_on_injection": True},
            "output": {"redact_sensitive": True},
            "tools": {"allowed": [], "blocked": []}
        }
    with open(POLICY_PATH, "r") as f:
        return yaml.safe_load(f)

class PolicyEngine:
    def __init__(self):
        self.policy = load_policy()

    def get(self, tenant_id: str = None):
        return self.policy
        
policy_engine = PolicyEngine()
