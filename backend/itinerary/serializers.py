from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Itinerary, ItineraryDay, Activity, Document, Collaborator
User = get_user_model()


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = [
            'id',
            'title',
            'description',
            'start_date',
            'end_date',
            'created_at',
            'updated_at',
            'user',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class CollaboratorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    user = UserCollaboratorSerializer(read_only=True)

    class Meta:
        model = Collaborator
        fields = [
            'itinerary', 'user', 'email'
        ]
        read_only_fields = ['itinerary', 'user']

    def validate_email(self, attrs):
        try:
            user = User.objects.get(email=attrs)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with that email.")

        self.context['collaborator_user'] = user
        return attrs

    def create(self, validated_data):
        user = self.context['collaborator_user']
        itinerary = validated_data['itinerary']

        if itinerary.user == user:
            raise serializers.ValidationError(
                "Cannot add the owner as collaborator.")

        if Collaborator.objects.filter(user=user, itinerary=itinerary).exists():
            raise serializers.ValidationError(
                "User is already a collaborator")

        return Collaborator.objects.create(user=user, itinerary=itinerary)


class DocumentSerializer(serializers.ModelSerializer):
    user = UserCollaboratorSerializer(read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'itinerary', 'user', 'doc_type', 'file', 'uploaded_at']
        read_only_fields = ['id', 'itinerary', 'user', 'uploaded_at']


class ItineraryDaySerializer(serializers.ModelSerializer):
    itinerary_title = serializers.CharField(
        source="itinerary.title", read_only=True)

    class Meta:
        model = ItineraryDay
        fields = [
            'id',
            'title',
            'date',
            'itinerary_title'
        ]
        read_only_fields = ['id']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id',
            'title',
            'time',
            'location_name',
            'address',
            'longitude',
            'latitude'
        ]
        read_only_fields = ['id']
