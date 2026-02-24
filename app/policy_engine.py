import yaml
from pathlib import Path

POLICY_PATH = Path("policy.yaml")

def load_policy():
    with open(POLICY_PATH, "r") as f:
        return yaml.safe_load(f)

class PolicyEngine:
    def get(self):
        return load_policy()

policy_engine = PolicyEngine()