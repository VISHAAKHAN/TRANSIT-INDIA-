LIMITS = {
    "sms": {"max": 10, "ttl": 3600},
    "ivr": {"max": 5, "ttl": 3600},
    "safety": {"max": 3, "ttl": 86400},
}


class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client

    def check(self, phone: str, channel: str) -> tuple[bool, int]:
        config = LIMITS.get(channel, LIMITS["sms"])
        key = f"rate:{phone}:{channel}"

        current = self.redis.get(key)
        if current is None:
            self.redis.incr(key)
            self.redis.expire(key, config["ttl"])
            return True, config["max"] - 1

        count = int(current) if isinstance(current, (str, bytes)) else current
        if count >= config["max"]:
            return False, 0

        self.redis.incr(key)
        return True, config["max"] - count - 1
