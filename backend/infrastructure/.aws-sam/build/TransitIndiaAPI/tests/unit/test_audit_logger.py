import json
from app.services.audit_logger import AuditLogger


class FakeS3:
    def __init__(self):
        self.objects = {}
    def put_object(self, Bucket, Key, Body):
        self.objects[Key] = Body


def test_log_creates_s3_object():
    s3 = FakeS3()
    logger = AuditLogger(s3_client=s3, bucket="test-bucket")
    logger.log(event_type="trip_status_change", data={"trip_id": "t1"}, confidence=0.9)
    assert len(s3.objects) == 1


def test_log_contains_required_fields():
    s3 = FakeS3()
    logger = AuditLogger(s3_client=s3, bucket="test-bucket")
    logger.log(event_type="arrival_prediction", data={"trip_id": "t1"}, confidence=0.75)
    key = list(s3.objects.keys())[0]
    body = json.loads(s3.objects[key])
    assert "timestamp" in body
    assert "event_type" in body
    assert "data" in body
    assert "confidence" in body
