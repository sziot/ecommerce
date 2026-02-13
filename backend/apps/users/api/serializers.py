"""
Serializers for users API.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from ..models import Address

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer for public data.
    """

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nickname', 'phone', 'avatar']
        read_only_fields = ['id']


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Detailed user serializer.
    """
    addresses_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'nickname', 'phone', 'avatar',
            'first_name', 'last_name', 'date_joined', 'addresses_count'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_addresses_count(self, obj):
        return obj.addresses.count()


class RegisterSerializer(serializers.ModelSerializer):
    """
    User registration serializer.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'nickname', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class AddressSerializer(serializers.ModelSerializer):
    """
    Address serializer.
    """

    class Meta:
        model = Address
        fields = [
            'id', 'receiver_name', 'receiver_phone', 'province',
            'city', 'district', 'detail', 'postal_code', 'is_default',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        # If setting as default, unset other default addresses
        if attrs.get('is_default', False):
            user = self.context['request'].user
            Address.objects.filter(
                user=user,
                is_default=True
            ).update(is_default=False)
        return attrs
