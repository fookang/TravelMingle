from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import Itinerary, ItineraryDay, Activity, Document, Collaborator
from .serializers import ItinerarySerializer, ItineraryDaySerializer, ActivitySerializer, DocumentSerializer, CollaboratorSerializer
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.core.exceptions import PermissionDenied

# Create your views here.


class ItineraryListCreate(generics.ListCreateAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owned = Itinerary.objects.filter(user=self.request.user)

        collaborating_ids = Collaborator.objects.filter(
            user=self.request.user).values_list('itinerary_id', flat=True)

        collaborating = Itinerary.objects.filter(id__in=collaborating_ids)

        return (owned | collaborating)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ItineraryDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'itinerary_id'

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)


class IsCollaboratorOwner(BasePermission):
    def has_permission(self, request, view):
        itinerary_id = view.kwargs.get("itinerary_id")
        is_collaborator = Collaborator.objects.filter(
            user=request.user, itinerary_id=itinerary_id).exists()
        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=request.user).exists()

        return is_owner or is_collaborator


class DocumentListCreate(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsCollaboratorOwner]

    def get_queryset(self):
        itinerary_id = self.kwargs.get("itinerary_id")

        # Is the user the itinerary owner?
        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        # Is the user a collaborator?
        is_collaborator = Collaborator.objects.filter(
            user=self.request.user, itinerary_id=itinerary_id).exists()

        if not (is_owner or is_collaborator):
            raise PermissionDenied(
                "You do not have permission to access the document to this itinerary.")

        return Document.objects.filter(itinerary_id=itinerary_id)

    def perform_create(self, serializer):
        itinerary_id = self.kwargs.get("itinerary_id")

        # Is the user the itinerary owner?
        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        # Is the user a collaborator?
        is_collaborator = Collaborator.objects.filter(
            user=self.request.user, itinerary_id=itinerary_id).exists()

        if not (is_owner or is_collaborator):
            raise PermissionDenied(
                "You do not have permission to add a document to this itinerary.")

        itinerary = get_object_or_404(Itinerary, id=itinerary_id)

        serializer.save(itinerary=itinerary, user=self.request.user)


class CollaboratorListCreate(generics.ListCreateAPIView):
    serializer_class = CollaboratorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        itinerary_id = self.kwargs.get("itinerary_id")
        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        is_collaborator = Collaborator.objects.filter(
            itinerary_id=itinerary_id, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise Http404
        return Collaborator.objects.filter(itinerary_id=itinerary_id)

    def perform_create(self, serializer):
        itinerary_id = self.kwargs.get("itinerary_id")

        # Only owner can add collaborators
        itinerary = get_object_or_404(
            Itinerary, id=itinerary_id)

        if itinerary.user != self.request.user:
            raise PermissionDenied("Only the owner can add collaborators.")

        serializer.save(itinerary=itinerary)


class ItineraryDayListCreate(generics.ListCreateAPIView):
    serializer_class = ItineraryDaySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        itinerary_id = self.kwargs.get("itinerary_id")

        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        is_collaborator = Collaborator.objects.filter(
            itinerary_id=itinerary_id, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise Http404
        return ItineraryDay.objects.filter(itinerary_id=itinerary_id)

    def perform_create(self, serializer):
        itinerary_id = self.kwargs.get("itinerary_id")

        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        is_collaborator = Collaborator.objects.filter(
            itinerary_id=itinerary_id, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise PermissionDenied(
                "You do not have permission to add a day to this itinerary.")

        itinerary = get_object_or_404(Itinerary, id=itinerary_id)
        serializer.save(itinerary=itinerary)


class ItineraryDayDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItineraryDaySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'day_id'

    def get_queryset(self):
        itinerary_id = self.kwargs.get("itinerary_id")

        is_owner = Itinerary.objects.filter(
            id=itinerary_id, user=self.request.user).exists()

        is_collaborator = Collaborator.objects.filter(
            itinerary_id=itinerary_id, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise PermissionDenied(
                "You do not have permission to add a day to this itinerary.")

        itinerary = get_object_or_404(Itinerary, id=itinerary_id)
        return ItineraryDay.objects.filter(itinerary=itinerary)


class ActivityListCreate(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        day_id = self.kwargs["day_id"]
        day = get_object_or_404(
            ItineraryDay.objects.select_related('itinerary'), id=day_id)

        itinerary = day.itinerary

        is_owner = itinerary.user == self.request.user

        is_collaborator = Collaborator.objects.filter(
            itinerary=itinerary, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise Http404

        return Activity.objects.filter(itinerary_day=day)

    def perform_create(self, serializer):
        day_id = self.kwargs["day_id"]
        day = get_object_or_404(
            ItineraryDay.objects.select_related('itinerary'), id=day_id)

        itinerary = day.itinerary

        is_owner = itinerary.user == self.request.user

        is_collaborator = Collaborator.objects.filter(
            itinerary=itinerary, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise PermissionDenied(
                "You do not have permission to add an activity to this itinerary.")

        serializer.save(itinerary_day=day)


class ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'activity_id'

    def get_queryset(self):
        day_id = self.kwargs["day_id"]
        day = get_object_or_404(
            ItineraryDay.objects.select_related('itinerary'), id=day_id)

        itinerary = day.itinerary

        is_owner = itinerary.user == self.request.user

        is_collaborator = Collaborator.objects.filter(
            itinerary=itinerary, user=self.request.user).exists()

        if not (is_owner or is_collaborator):
            raise Http404

        return Activity.objects.filter(itinerary_day=day)
