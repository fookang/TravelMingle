from django.contrib import admin
from .models import Itinerary, ItineraryDay, Activity


# Register your models here.
admin.site.register(Itinerary)
admin.site.register(ItineraryDay)
admin.site.register(Activity)
