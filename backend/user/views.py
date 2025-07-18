from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response



# Create your views here.

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class GetUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    
    def get_object(self):
        return self.request.user