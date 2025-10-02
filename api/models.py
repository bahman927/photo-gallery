from django.db import models
from datetime import date
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Photo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="photos")  
    
    image = models.ImageField(upload_to='photos/')
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="photos", blank=True, null=True) 
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Photo {self.id}"
