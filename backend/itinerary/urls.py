from django.urls import path
from . import views

urlpatterns = [
    path('', views.ItineraryListCreate.as_view(), name='itinerary-list'),

    path('<int:itinerary_id>/',
         views.ItineraryDetail.as_view(),
         name='itinerary-detail'),

    path('<int:itinerary_id>/days/',
         views.ItineraryDayListCreate.as_view(), name='itinerary-days'),

    path('<int:itinerary_id>/documents/',
         views.DocumentListCreate.as_view(), name='documents'),

    path('itineraries/<int:itinerary_id>/collaborators/',
         views.CollaboratorListCreate.as_view(), name='itinerary-collaborators'),


    path('<int:itinerary_id>/days/<int:day_id>/',
         views.ItineraryDayDetail.as_view(), name='itinerary-day-detail'),

    path('<int:itinerary_id>/days/<int:day_id>/activities/',
         views.ActivityListCreate.as_view(), name='activities'),

    path('<int:itinerary_id>/days/<int:day_id>/activities/<int:activity_id>/',
         views.ActivityDetail.as_view(), name='activity-detail'),
]
