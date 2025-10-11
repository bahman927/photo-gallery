from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.http import HttpResponse
from django.views.generic import TemplateView

def home(request):
    return HttpResponse("✅ Django is running on Render!")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home), 
    path("", include("api.urls")),   # replace with your app
    path("", TemplateView.as_view(template_name="index.html")), 
     
]

# Serve static + media in development
if settings.DEBUG  and settings.ENVIRONMENT == "development":
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
