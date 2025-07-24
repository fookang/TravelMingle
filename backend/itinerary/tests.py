from rest_framework import status
from django.urls import reverse
from .models import Itinerary, ItineraryDay, Activity
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
        self.activity = Activity.objects.create(
            itineraryDay=self.day, title='Breakfast', time='09:00')

    def test_list_itineraries(self):
        url = reverse('itinerary')
        response = self.client.get(url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], 'Japan Trip')
        self.assertEqual(response.data[0]['start_date'], '2024-07-01')
        self.assertEqual(response.data[0]['end_date'], '2024-07-14')

    def test_list_itineraryDay(self):
        url = reverse('itinerary-day',
                      kwargs={'itinerary_id': self.itinerary.id})
        response = self.client.get(url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], 'Arrival')
        self.assertEqual(response.data[0]['date'], '2024-07-01')

    def test_list_activity(self):
        url = reverse('activity',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id})
        response = self.client.get(url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], 'Breakfast')
        self.assertEqual(response.data[0]['time'], '09:00:00')

    def test_create_itineraries(self):
        url = reverse('itinerary')
        data = {
            'title': 'China Trip',
            'start_date': '2024-07-01',
            'end_date': '2024-07-14'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'China Trip')
        self.assertEqual(response.data['start_date'], '2024-07-01')
        self.assertEqual(response.data['end_date'], '2024-07-14')

    def test_create_itineraryDay(self):
        url = reverse('itinerary-day',
                      kwargs={'itinerary_id': self.itinerary.id})
        data = {
            'title': 'Shopping',
            'date': '2024-07-02'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Shopping')
        self.assertEqual(response.data['date'], '2024-07-02')

    def test_create_activity(self):
        url = reverse('activity',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id})
        data = {
            'title': 'lunch',
            'time': '12:00'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'lunch')
        self.assertEqual(response.data['time'], '12:00:00')

    def test_update_itineraries(self):
        url = reverse('itinerary-detail',
                      kwargs={'itinerary_id': self.itinerary.id})
        data = {
            'title': 'Japan',
            'start_date': '2024-06-30'
        }
        response = self.client.patch(url, data, format='json')
        print(response.data)
        self.assertEqual(response.data['title'], 'Japan')
        self.assertEqual(response.data['start_date'], '2024-06-30')

    def test_update_itineraryDay(self):
        url = reverse('itinerary-day-detail',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id})
        data = {
            'date': '2024-06-30'
        }
        response = self.client.patch(url, data, format='json')
        print(response.data)
        self.assertEqual(response.data['title'], 'Arrival')
        self.assertEqual(response.data['date'], '2024-06-30')

    def test_update_activity(self):
        url = reverse('activity-detail',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id, 'activity_id': self.activity.id})
        data = {
            'time': '08:00'
        }
        response = self.client.patch(url, data, format='json')
        print(response.data)
        self.assertEqual(response.data['title'], 'Breakfast')
        self.assertEqual(response.data['time'], '08:00:00')

    def test_delete_itineraries(self):
        url = reverse('itinerary-detail',
                      kwargs={'itinerary_id': self.itinerary.id})
        response = self.client.delete(url)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Itinerary.objects.filter(
            id=self.itinerary.id).exists())

    def test_delete_itineraryDay(self):
        url = reverse('itinerary-day-detail',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id})
        response = self.client.delete(url)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ItineraryDay.objects.filter(
            id=self.day.id).exists())

    def test_delete_activity(self):
        url = reverse('activity-detail',
                      kwargs={'itinerary_id': self.itinerary.id, 'day_id': self.day.id, 'activity_id': self.activity.id})
        response = self.client.delete(url)
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Activity.objects.filter(
            id=self.activity.id).exists())
