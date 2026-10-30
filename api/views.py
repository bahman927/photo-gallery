from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Photo
from .serializers import PhotoSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import datetime
import boto3

def test_s3_upload(request):
    message = ""
    uploaded_url = None
    s3_files = []

    # ✅ Initialize boto3 client directly (to list objects)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    # 🟢 1. Handle Upload (POST)
    if request.method == "POST":
        try:
            filename = f"photos/test_from_render_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            content = "<h1>Hello from Render!</h1><p>This is a test upload to S3.</p>"
            file_obj = ContentFile(content.encode("utf-8"))

            # Save to S3
            path = default_storage.save(filename, file_obj)
            uploaded_url = f"{settings.MEDIA_URL}{path}"
            message = f"✅ File uploaded successfully: {uploaded_url}"

            print("✅ Upload successful:", uploaded_url)

        except Exception as e:
            message = f"❌ Upload failed: {e}"
            print("❌ Upload failed:", e)

    # 🟡 2. List existing files in S3 /photos/
    try:
        response = s3.list_objects_v2(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Prefix="photos/"
        )

        if "Contents" in response:
            s3_files = [
                f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{item['Key']}"
                for item in response["Contents"]
            ]
        else:
            message += "\n(No files found in /photos/)"
    except Exception as e:
        message += f"\n❌ Could not list S3 files: {e}"

    return render(
        request,
        "api/test_upload.html",
        {"message": message, "uploaded_url": uploaded_url, "s3_files": s3_files},
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Please provide username and password"}, status=400)

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
    else:
        return Response({"error": "Invalid Credentials"}, status=400)
    

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])  
@parser_classes([MultiPartParser, FormParser])
def photo_list_create(request):

    from django.conf import settings

    print("R2 access key exists:", bool(settings.AWS_ACCESS_KEY_ID))
    print("R2 secret key exists:", bool(settings.AWS_SECRET_ACCESS_KEY))
    print("R2 bucket:", settings.AWS_STORAGE_BUCKET_NAME)
    print("R2 endpoint:", settings.AWS_S3_ENDPOINT_URL)
    print("DEBUG request.data:", request.data)

    # if request.method == "GET":
    #     photos = Photo.objects.all().order_by("-uploaded_at")
    #     serializer = PhotoSerializer(photos, many=True, context={"request": request})

    #     return Response(serializer.data)
    if request.method == "GET":
        try:
            photos = Photo.objects.all().order_by("-uploaded_at")

            serializer = PhotoSerializer(
                photos,
                many=True,
                context={"request": request}
            )

            return Response(serializer.data)

        except Exception as e:
            import traceback
            print("PHOTO GET ERROR:", repr(e))
            traceback.print_exc()
            raise

    elif request.method == "POST":

        if not request.user.is_staff:
            return Response({"detail": "Only admin can upload photos."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PhotoSerializer(data=request.data, context={"request": request})

        print("DEBUG: Starting validation")

        if serializer.is_valid():
            print("DEBUG: Validation successful")
            print("DEBUG: Validated data:", serializer.validated_data)

            try:
                photo = serializer.save()
                print("DEBUG: Photo saved successfully:", photo.id)

                return Response({
                    "success": True,
                    "data": PhotoSerializer(
                        photo,
                        context={"request": request}
                    ).data,
                    "message": "Photo uploaded successfully"
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                import traceback
                print("UPLOAD ERROR:", repr(e))
                traceback.print_exc()
                raise

        else:
            print("DEBUG: Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        # if serializer.is_valid():
        #     serializer.save()
        #     return Response({
        #         "success": True,
        #         "data": serializer.data,
        #         "message": "Photo uploaded successfully"
        #     }, status=status.HTTP_201_CREATED,
        #     )
        # else:
        #  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE", "PATCH"])
@permission_classes([IsAuthenticatedOrReadOnly])
def photo_detail(request, pk):
    try:
        photo = Photo.objects.get(pk=pk)
    except Photo.DoesNotExist:
        return Response({"detail": "Photo not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PhotoSerializer(photo)
        return Response(serializer.data)

    elif request.method in [ "PUT", "PATCH"]:
        # ✅ Only uploader or admin can update
        if request.user != photo.uploader and not request.user.is_staff:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        serializer = PhotoSerializer(photo, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors,   status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # ✅ Only uploader or admin can delete
        if request.user != photo.uploader and not request.user.is_staff:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        photo.delete()
        return Response({"detail": "Photo deleted."}, status=status.HTTP_204_NO_CONTENT)




