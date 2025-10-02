from django.contrib import admin
from .models import Category, Photo

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")         # show ID + name
    search_fields = ("name",)             # search by name
    ordering = ("name",)                  # alphabetically

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "name", "uploaded_at", "image_preview")
    list_filter = ("category", "uploaded_at")   # filter sidebar
    search_fields = ("title", "description", "name", "category__name")
    ordering = ("-uploaded_at",)

    # make the uploaded image preview visible in admin
    def image_preview(self, obj):
        if obj.image:
            return f"<img src='{obj.image.url}' style='width:50px; height:50px; object-fit:cover;' />"
        return "No Image"
    image_preview.allow_tags = True
    image_preview.short_description = "Preview"
