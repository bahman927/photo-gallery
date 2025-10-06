import boto3
from django.conf import settings

s3 = boto3.client(
    "s3",
    region_name=settings.AWS_S3_REGION_NAME,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    config=boto3.session.Config(signature_version="s3v4"),
)

def get_signed_url(key):
    """Generate a temporary presigned URL for a private S3 object."""
    return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": key,
        },
        ExpiresIn=604800,  # 7 days
    )
