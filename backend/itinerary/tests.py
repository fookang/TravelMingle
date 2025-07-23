from rest_framework import status
from django.urls import reverse
from .models import Itinerary, ItineraryDay
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
User = get_user_model()


# Create your tests here.


class ItineraryAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser6', password='supersecurepassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.itinerary = Itinerary.objects.create(
            user=self.user, title='Japan Trip', start_date='2024-07-01', end_date='2024-07-14')
        self.day = ItineraryDay.objects.create(
            itinerary=self.itinerary, title='Arrival', date='2024-07-01')

    def test_list_itineraries(self):
        url = reverse('itinerary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
