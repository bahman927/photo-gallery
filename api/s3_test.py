import os
import sys
import django
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
bucket = os.environ.get("AWS_STORAGE_BUCKET_NAME", "photo-app-bahman-123")
os.environ["AWS_STORAGE_BUCKET_NAME"] = bucket

# -------------------------------
# 1️⃣ Add project root to sys.path
# -------------------------------
# Replace this path with the folder that contains manage.py
project_root = r"C:\Users\bahma\Oracle\Desktop\Photo-Gallery"
sys.path.append(project_root)

# -------------------------------
# 2️⃣ Set Django settings module
# -------------------------------
# Replace 'backend.settings' with your actual settings module if different
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
print("DEBUG: AWS_STORAGE_BUCKET_NAME =", os.environ.get("AWS_STORAGE_BUCKET_NAME"))

# -------------------------------
# 3️⃣ Initialize Django
# -------------------------------
django.setup()

# -------------------------------
# 4️⃣ Upload test file to S3
# -------------------------------
def upload_test_file():
    try:
        # Create a sample file in memory
        content = ContentFile(b"Hello S3! Test upload from s3_test.py")
        filename = "test_upload.txt"  # path inside your S3 bucket

        # Save file to S3
        saved_path = default_storage.save(filename, content)

        # Get full URL
        file_url = default_storage.url(saved_path)
        print("✅ File saved to S3 at:", file_url)

    except Exception as e:
        print("❌ Error uploading to S3:", e)

# -------------------------------
# 5️⃣ Run the test
# -------------------------------
if __name__ == "__main__":
    upload_test_file()
