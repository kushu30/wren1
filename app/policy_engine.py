import yaml
from pathlib import Path

POLICY_PATH = Path("policy.yaml")

def load_policy():
    with open(POLICY_PATH, "r") as f:
        return yaml.safe_load(f)

class PolicyEngine:
    def __init__(self):
        self.policy = load_policy()

    def get(self, tenant_id: str = None):
        return self.policy
        
policy_engine = PolicyEngine()