
import os
import sys
import django

# 1. Add project root to Python path
project_root = r"C:\Users\bahma\Oracle\Desktop\Photo-Gallery"
sys.path.insert(0, project_root)

# 2. Set Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 3. Initialize Django
django.setup()

# Import settings and storage AFTER django.setup()
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


# 4. Display configuration
# print("Bucket:", settings.AWS_STORAGE_BUCKET_NAME)
print("R2 endpoint:", settings.AWS_S3_ENDPOINT_URL)
print("Access key exists:", bool(settings.AWS_ACCESS_KEY_ID))
print("Secret key exists:", bool(settings.AWS_SECRET_ACCESS_KEY))
print("Storage backend:", default_storage.__class__.__name__)


# 5. Upload test file
def upload_test_file():
    try:
        content = ContentFile(b"Hello R2! Test upload from s3_test.py")

        filename = "test_upload.txt"

        saved_path = default_storage.save(filename, content)

        file_url = default_storage.url(saved_path)

        print("SUCCESS: File uploaded!")
        print("Saved path:", saved_path)
        print("File URL:", file_url)

    except Exception as e:
        import traceback
        print("UPLOAD ERROR:", repr(e))
        traceback.print_exc()


if __name__ == "__main__":
    upload_test_file()
