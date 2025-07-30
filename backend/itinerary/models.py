from django.db import models
from django.conf import settings


def document_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.user.username}_{instance.itinerary.id}_{instance.doc_type}.{ext}"
    return f"documents/{filename}"


class Itinerary(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Collaborator(models.Model):
    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )


class Document(models.Model):
    DOCUMNET_TYPES = [
        ('passport', 'Passport'),
        ('visa', 'Visa'),
        ('flight', 'Flight'),
        ('insurance', 'Insurance'),
    ]
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=20, choices=DOCUMNET_TYPES)
    file = models.FileField(upload_to=document_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class ItineraryDay(models.Model):
    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=50)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.itinerary.title} - {self.date}"


class Activity(models.Model):
    itinerary_day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE)
    time = models.TimeField()
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    location_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.time}"
