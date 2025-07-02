from django.contrib.auth import get_user_model
from rest_framework import serializers
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required' : True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False}
        }
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user