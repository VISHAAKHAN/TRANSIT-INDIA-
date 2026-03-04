from app.services.rate_limiter import RateLimiter


class FakeRedis:
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def incr(self, key):
        self.store[key] = self.store.get(key, 0) + 1
        return self.store[key]
    def expire(self, key, seconds):
        pass


def test_first_request_allowed():
    limiter = RateLimiter(FakeRedis())
    allowed, remaining = limiter.check("1234567890", "sms")
    assert allowed is True


def test_sms_limit_10_per_hour():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for _ in range(10):
        allowed, _ = limiter.check("1234567890", "sms")
        assert allowed is True
    allowed, _ = limiter.check("1234567890", "sms")
    assert allowed is False


def test_safety_limit_3_per_day():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for _ in range(3):
        allowed, _ = limiter.check("1234567890", "safety")
        assert allowed is True
    allowed, _ = limiter.check("1234567890", "safety")
    assert allowed is False


def test_different_phones_independent():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for _ in range(10):
        limiter.check("1111111111", "sms")
    allowed, _ = limiter.check("2222222222", "sms")
    assert allowed is True
