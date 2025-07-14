from django.contrib.auth import get_user_model
from rest_framework import serializers
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)

    
    class Meta:
        model = User
        exclude = ['user_permissions']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
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
    
    def validate_avatar(self, value):
        
        if not value or isinstance(value, str):
            return value
        
        if hasattr(value, 'name'):
            if value and not value.name.lower().endswith(('.png', '.jpg', '.jpeg')):
                raise serializers.ValidationError("Only .png, .jpg, or .jpeg images are allowed.")
        return value
    
    def validate(self, data):
        if 'password' in data and self.instance:
            old_password = data.get('old_password')
            if not old_password:
                raise serializers.ValidationError({'old_password': 'This field is required for password change'})
            if not self.instance.check_password(old_password):
                raise serializers.ValidationError("Password is incorrect")
        return data

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        validated_data.pop('old_password',None)
        
        return super().update(instance, validated_data)