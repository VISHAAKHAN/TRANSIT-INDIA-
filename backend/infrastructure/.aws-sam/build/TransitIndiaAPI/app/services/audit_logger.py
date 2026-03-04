import json
import uuid
from datetime import datetime


class AuditLogger:
    def __init__(self, s3_client, bucket: str):
        self.s3 = s3_client
        self.bucket = bucket

    def log(self, event_type: str, data: dict, confidence: float = None):
        entry = {
            "audit_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "data": data,
            "confidence": confidence,
        }
        now = datetime.utcnow()
        key = f"audit/{now.strftime('%Y/%m/%d')}/{entry['audit_id']}.json"
        self.s3.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(entry),
        )
