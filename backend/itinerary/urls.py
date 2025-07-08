from django.urls import path
from . import views

urlpatterns = [
    path('', views.ItineraryListCreate.as_view(), name='itinerary'),
    path('<int:itinerary_id>/days/', views.ItineraryDayListCreate.as_view(), name='itinerary-day'),
    path('<int:itinerary_id>/days/<int:day_id>/activities/', views.ActivityListCreate.as_view(), name='activity'),
]

