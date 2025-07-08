from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Itinerary, ItineraryDay, Activity
from .serializers import ItinerarySerializer, ItineraryDaySerializer, ActivitySerializer
from django.shortcuts import get_object_or_404


# Create your views here.
class ItineraryListCreate(generics.ListCreateAPIView):
    serializer_class = ItinerarySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    
class ItineraryDayListCreate(generics.ListCreateAPIView):
    serializer_class = ItineraryDaySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        itinerary = get_object_or_404(
            Itinerary, 
            id=self.kwargs.get("itinerary_id"), user=self.request.user)
        return ItineraryDay.objects.filter(itinerary=itinerary)

    def perform_create(self, serializer):
        itinerary = get_object_or_404(
            Itinerary, 
            id=self.kwargs["itinerary_id"], 
            user=self.request.user)
        serializer.save(itinerary=itinerary)

    
class ActivityListCreate(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        day = get_object_or_404(
            ItineraryDay, 
            id=self.kwargs["day_id"], itinerary__user=self.request.user)
        return Activity.objects.filter(itineraryday=day)

    def perform_create(self, serializer):
        day = get_object_or_404(
            ItineraryDay, 
            id=self.kwargs["day_id"], itinerary__user=self.request.user)
        serializer.save(itineraryday=day)