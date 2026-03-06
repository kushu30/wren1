import time
from collections import defaultdict

RATE_LIMIT = 60  # requests per minute per tenant

rate_limits = defaultdict(list)


def check_rate_limit(tenant_id: str) -> bool:
    now = time.time()
    window_start = now - 60

    requests = rate_limits[tenant_id]

    # remove old requests
    rate_limits[tenant_id] = [
        timestamp for timestamp in requests
        if timestamp > window_start
    ]

    if len(rate_limits[tenant_id]) >= RATE_LIMIT:
        return False

    rate_limits[tenant_id].append(now)
    return True