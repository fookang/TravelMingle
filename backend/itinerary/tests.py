from rest_framework import status
from django.urls import reverse
from .models import Itinerary, ItineraryDay, Activity, Collaborator, Document
from rest_framework.test import APITestCase, APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

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


class TestCollaboratorAPI(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='owner', password='supersecurepassword',
            email='owner@gmail.com',
            first_name='owner',
            last_name='user'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.owner)
        self.itinerary = Itinerary.objects.create(
            user=self.owner, title='Japan Trip', start_date='2024-07-01', end_date='2024-07-14')
        self.collaborator = User.objects.create_user(
            username='collaborator',
            password='supersecurepassword',
            email='collaborator@gmail.com',
            first_name='collaborator',
            last_name='user'
        )

    def test_owner_can_add_collaborator(self):
        url = reverse('itinerary-collaborators', kwargs={
            'itinerary_id': self.itinerary.id
        })
        data = {
            'email': 'collaborator@gmail.com'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']
                         ['username'], self.collaborator.username)
        self.assertTrue(
            Collaborator.objects.filter(
                user__email='collaborator@gmail.com',
                itinerary=self.itinerary
            ).exists()
        )
        print(response.data)

    def test_wrong_email(self):
        url = reverse('itinerary-collaborators', kwargs={
            'itinerary_id': self.itinerary.id
        })
        data = {
            'email': 'collaboratorr@gmail.com'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print(response.data)

    def test_collaborator_cannot_add_collaborator(self):
        self.collaborator2 = User.objects.create_user(
            username='collaborator2',
            password='supersecurepassword',
            email='collaborator2@gmail.com',
            first_name='collaborator',
            last_name='user'
        )
        Collaborator.objects.create(
            user=self.collaborator, itinerary=self.itinerary)

        self.client.force_authenticate(user=self.collaborator)

        url = reverse('itinerary-collaborators', kwargs={
            'itinerary_id': self.itinerary.id
        })
        data = {
            'email': 'collaborator2@gmail.com'
        }
        response = self.client.post(
            url,
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print(response.data)

    def test_list_collaborator(self):
        Collaborator.objects.create(
            user=self.collaborator, itinerary=self.itinerary)

        url = reverse('itinerary-collaborators', kwargs={
            'itinerary_id': self.itinerary.id
        })
        response = self.client.get(url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get(url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestDocumentAPI(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='owner', password='supersecurepassword',
            email='owner@gmail.com',
            first_name='owner',
            last_name='user'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.owner)
        self.itinerary = Itinerary.objects.create(
            user=self.owner, title='Japan Trip', start_date='2024-07-01', end_date='2024-07-14')

        self.collaborator = User.objects.create_user(
            username='collaborator',
            password='supersecurepassword',
            email='collaborator@gmail.com',
            first_name='collaborator',
            last_name='user'
        )
        Collaborator.objects.create(
            user=self.collaborator, itinerary=self.itinerary)

    def test_owner_add_document(self):
        url = reverse('documents', kwargs={
            'itinerary_id': self.itinerary.id
        })

        pdf_content = b'%PDF-1.4 fake content for testing\n%%EOF'

        fake_pdf = SimpleUploadedFile(
            "test.pdf",               # file name
            pdf_content,              # file content (bytes)
            content_type="application/pdf"
        )

        data = {
            'doc_type': 'passport',
            "file": fake_pdf
        }

        response = self.client.post(
            url,
            data,
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_collaborator_add_document(self):
        url = reverse('documents', kwargs={
            'itinerary_id': self.itinerary.id
        })

        pdf_content = b'%PDF-1.4 fake content for testing\n%%EOF'

        fake_pdf = SimpleUploadedFile(
            "test.pdf",               # file name
            pdf_content,              # file content (bytes)
            content_type="application/pdf"
        )

        data = {
            'doc_type': 'passport',
            "file": fake_pdf
        }
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.post(
            url,
            data,
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_owner_list_document(self):
        url = reverse('documents', kwargs={
            'itinerary_id': self.itinerary.id
        })
        fake_file = SimpleUploadedFile(
            "passport.pdf", b"fake-content", content_type="application/pdf")

        Document.objects.create(
            user=self.owner,
            itinerary=self.itinerary,
            doc_type="passport",
            file=fake_file
        )
        Document.objects.create(
            user=self.collaborator,
            itinerary=self.itinerary,
            doc_type="passport",
            file=fake_file
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_collaborator_list_document(self):
        url = reverse('documents', kwargs={
            'itinerary_id': self.itinerary.id
        })
        fake_file = SimpleUploadedFile(
            "passport.pdf", b"fake-content", content_type="application/pdf")

        Document.objects.create(
            user=self.owner,
            itinerary=self.itinerary,
            doc_type="passport",
            file=fake_file
        )
        Document.objects.create(
            user=self.collaborator,
            itinerary=self.itinerary,
            doc_type="passport",
            file=fake_file
        )
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
