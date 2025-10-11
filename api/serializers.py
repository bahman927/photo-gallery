from rest_framework import serializers
from .models import Photo, Category
# from backend.utils.s3_utils import get_signed_url

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
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Photo
        fields = "__all__"

    