from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://transit:transit@localhost:5432/transitindia"
    redis_url: str = "redis://localhost:6379"
    aws_region: str = "ap-south-1"
    sagemaker_forecasting_endpoint: str = "transit-forecasting"
    sagemaker_delay_endpoint: str = "transit-delay-classifier"
    audit_bucket: str = "transit-india-audit-logs"
    ml_bucket: str = "transit-india-ml-data"
    timestream_database: str = "transit_india"
    sms_rate_limit: int = 10
    ivr_rate_limit: int = 5
    safety_rate_limit: int = 3

    class Config:
        env_prefix = "TRANSIT_"


settings = Settings()
