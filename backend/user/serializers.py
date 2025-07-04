from django.contrib.auth import get_user_model
from rest_framework import serializers
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['user_permissions']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required' : True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False}
        }
    def create(self, validated_data):
        group_data = validated_data.pop('groups', None)
        user = User.objects.create_user(**validated_data)
        if group_data:
            user.groups.set(group_data)
        return user