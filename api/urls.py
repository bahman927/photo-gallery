from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import photo_list_create, photo_detail
from .views import login_view


urlpatterns = [
    path("login/",  login_view, name="login"),   
    path("photos/", photo_list_create, name="photo-list-create"),
    path("photos/<int:pk>/", photo_detail, name="photo-detail"),   
    path('token/',   TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view()),   # returns new access token
   
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



 