from django.urls import path
from . import views

urlpatterns = [
    path('', views.ItineraryListCreate.as_view(), name='itinerary'),
    path('<int:itinerary_id>/', views.ItineraryDetail.as_view(),
         name='itinerary-detail'),
    path('<int:itinerary_id>/days/',
         views.ItineraryDayListCreate.as_view(), name='itinerary-day'),
    path('<int:itinerary_id>/days/<int:day_id>/',
         views.ItineraryDayDetail.as_view(), name='itinerary-day-detail'),
    path('<int:itinerary_id>/days/<int:day_id>/activities/',
         views.ActivityListCreate.as_view(), name='activity'),
    path('<int:itinerary_id>/days/<int:day_id>/activities/<int:activity_id>/',
         views.ActivityDetail.as_view(), name='activity-detail'),
]
