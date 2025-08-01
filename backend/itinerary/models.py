from django.db import models
from django.conf import settings


def document_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.user.id}_{instance.itinerary.id}_{instance.doc_type}.{ext}"
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
    DOCUMENT_TYPES = [
        ('passport', 'Passport'),
        ('visa', 'Visa'),
        ('flight', 'Flight'),
        ('insurance', 'Insurance'),
    ]
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to=document_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('itinerary', 'user', 'doc_type')

    def save(self, *args, **kwargs):
        try:
            old_doc = Document.objects.get(
                user=self.user,
                itinerary=self.itinerary,
                doc_type=self.doc_type
            )
            if old_doc.pk != self.pk:
                if old_doc.file:
                    old_doc.file.delete(save=False)
                old_doc.delete()
        except Document.DoesNotExist:
            pass

        return super().save(*args, **kwargs)


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
