from django.contrib.auth import get_user_model
from rest_framework import serializers
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        exclude = ['user_permissions']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': True, 'allow_blank': False},
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
                raise serializers.ValidationError(
                    "Only .png, .jpg, or .jpeg images are allowed.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Password is incorrect")
        return value

    def validate(self, data):
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError("New password must be different")
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
