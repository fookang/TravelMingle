from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Itinery, ItineryDay, Activity

# Create your views here.
class ItineraryListCreate(generics.ListCreateAPIView):
    # serializer_class = ItinerarySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Itinery.objects.filter(user=self.request.user)
    
    
class ItineraryDayListCreate(generics.ListCreateAPIView):
    # serializer_class = ItineraryDaySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ItineryDay.objects.filter(itinerary=self.kwargs.get("itinerary_id"))


    
class ActivityListCreate(generics.CreateAPIView):
    # serializer_class = ActivitySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Activity.objects.filter(itineraryday=self.kwargs.get("day_id"))