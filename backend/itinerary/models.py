from django.db import models
from django.conf import settings


class Itinerary(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    
class ItineraryDay(models.Model):
    itinerary = models.ForeignKey(
        Itinerary, 
        on_delete = models.CASCADE
    )
    title = models.CharField(max_length=50)
    date = models.DateField()
    
    def __str__(self):
        return f"{self.itinery.title} - {self.date}"
    
class Activity(models.Model):
    itineraryday = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE)
    time = models.TimeField()
    title = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.title} - {self.time}"