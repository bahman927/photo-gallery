from rest_framework import serializers
from .models import Photo, Category
from .utils.s3_utils import get_signed_url

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class PhotoSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)  
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    # image = serializers.ImageField(use_url=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = "__all__"
     
    def get_image(self, obj):
        try:
            if obj.image:
                signed_url = get_signed_url(obj.image.name)
                print("Generated signed URL:", signed_url)
                return signed_url
        except Exception as e:
            print("⚠️ S3 ERROR in get_image():", e)
            return None
        return None   

    # def get_image(self, obj):
    #     """
    #     Return either a public image URL or a temporary signed URL
    #     for private S3 images.
    #     """
    #     request = self.context.get("request")

    #     if not obj.image:
    #         return None

    #     # Direct URL (already absolute)
    #     image_url = obj.image.url

    #     # Case 1: already public (e.g. starts with 'http')
    #     if image_url.startswith("http"):
    #         return image_url

    #     # Case 2: local or private S3 path (needs signing)
    #     try:
    #         # get the S3 key (path relative to the bucket)
    #         key = image_url.lstrip("/")  # e.g., "photos/Hana-img28.JPG"
    #         signed_url = get_signed_url(key)
    #         return signed_url
    #     except Exception as e:
    #         # fallback — avoid breaking serialization
    #         print(f"Error generating signed URL: {e}")
    #         return request.build_absolute_uri(image_url)