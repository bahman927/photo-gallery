
import os
import django
import boto3
from pathlib import PurePosixPath

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.conf import settings
from django.db import transaction
from api.models import Photo, Category

s3 = boto3.client(
    "s3",
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name="auto",
)

people = Category.objects.get(id=6)

paginator = s3.get_paginator("list_objects_v2")

image_keys = []

for page in paginator.paginate(
    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
    Prefix="photos/",
):
    for obj in page.get("Contents", []):
        key = obj["Key"]

        if key.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            image_keys.append(key)

created = 0
skipped = 0

with transaction.atomic():
    for key in image_keys:
        filename = PurePosixPath(key).name
        title = PurePosixPath(filename).stem

        if Photo.objects.filter(image=key).exists():
            skipped += 1
            continue

        Photo.objects.create(
            title=title,
            name=filename,
            description="",
            category=people,
            image=key,
            uploader=None,
        )

        created += 1

print("Images found:", len(image_keys))
print("Records created:", created)
print("Duplicates skipped:", skipped)
print("Total Photo records:", Photo.objects.count())
