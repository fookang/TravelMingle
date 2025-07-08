from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Itinerary, ItineraryDay, Activity
from .serializers import ItinerarySerializer, ItineraryDaySerializer, ActivitySerializer

# Create your views here.
class ItineraryListCreate(generics.ListCreateAPIView):
    serializer_class = ItinerarySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)
    
    
class ItineraryDayListCreate(generics.ListCreateAPIView):
    serializer_class = ItineraryDaySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ItineraryDay.objects.filter(itinerary=self.kwargs.get("itinerary_id"))


    
class ActivityListCreate(generics.CreateAPIView):
    serializer_class = ActivitySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Activity.objects.filter(itineraryday=self.kwargs.get("day_id"))