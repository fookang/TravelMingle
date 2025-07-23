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
        
        
class CollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaborator
        fields = [
            'itinerary', 'user'
        ]
        read_only_fields = ['itinerary', 'user']    
  
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'itinerary', 'user', 'doc_type', 'file', 'uploaded_at']
        read_only_fields = ['id','itinerary', 'user', 'uploaded_at'] 
      
      
class ItineraryDaySerializer(serializers.ModelSerializer):
    itinerary_title = serializers.CharField(source="itinerary.title",read_only=True)
    
    class Meta:
        model = ItineraryDay
        fields = [
            'id',
            'title',
            'date',
            'itinerary_title'
        ]

        
        
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id',
            'title',
            'time'
        ]