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
    print("DEBUG request.data:", request.data)
    if request.method == "GET":
        photos = Photo.objects.all().order_by("-uploaded_at")
        serializer = PhotoSerializer(photos, many=True, context={"request": request})

        return Response(serializer.data)

    elif request.method == "POST":

        if not request.user.is_staff:
            return Response({"detail": "Only admin can upload photos."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PhotoSerializer(data=request.data, context={"request": request})


        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "data": serializer.data,
                "message": "Photo uploaded successfully"
            }, status=status.HTTP_201_CREATED,
            )
        else:
         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        serializer = PhotoSerializer(photo, data=request.data, partial=True)  # partial=True allows updating some fields
        # serializer = PhotoSerializer(photo, data=request.data, partial=(request.method == "PATCH"))
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








# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def protected_view(request):
#     return Response({"message": f"Hello {request.user.username}, you are authenticated!"})

# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

# # create
# # class PhotoCreateAPIView(APIView):
#     def post(self, request):
#         serializer = PhotoSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         print("Serializer errors:", serializer.errors)
#         return Response(serializer.errors, status=400)


# class PhotoViewSet(viewsets.ModelViewSet):
#     queryset = Photo.objects.all()
#     serializer_class = PhotoSerializer
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['category__name']  # allows ?search=Nature
# # 📌 Update
# class PhotoUpdateAPIView(APIView):
#     def put(self, request, pk):
#         print('pk=',pk, 'request.data= ', request.data)
#         try:
#             photo = Photo.objects.get(pk=pk)
#         except Photo.DoesNotExist:
#             return Response({'error': 'Not found'}, status=404)

#         serializer = PhotoSerializer(photo, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

# # 📌 Delete
# class PhotoDeleteAPIView(APIView):
  
#     def delete(self, request, pk):
#         try:
#             photo = Photo.objects.get(pk=pk)
#         except Photo.DoesNotExist:
#             return Response({'error': 'Not found'}, status=404)

#         photo.delete()
#         return Response(status=204)
    
# #  List photos
# class PhotoListAPIView(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request):
#         photos = Photo.objects.all()
#         serializer = PhotoSerializer(photos, many=True)
#         return Response(serializer.data)

      
# class LogoutView(APIView):
#      def post(self, request):
#         request.user.auth_token.delete()
#         return Response(status=204)
     
# class LoginAPIView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         user = authenticate(username=username, password=password)
#         if user is not None:
#             # Generate tokens for the authenticated user
#             refresh = RefreshToken.for_user(user)
            
#             data = {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'username': user.username,
#                 'email': user.email,
#             }
            
#             response = Response(data, status=status.HTTP_200_OK)
#             return response
        
#         return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
# class CustomTokenRefreshView(TokenRefreshView):
#     """
#     Custom TokenRefreshView to issue a new access token.
#     By default, SimpleJWT only refreshes the access token,
#     but if you enable ROTATE_REFRESH_TOKENS, you'll also get a new refresh token.
#     """
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)

#         if response.status_code == 200:
#             return Response({
#                 "access": response.data.get("access"),
#                 "refresh": response.data.get("refresh")  # only present if rotation enabled
#             }, status=status.HTTP_200_OK)

#         return response