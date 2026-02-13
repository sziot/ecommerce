"""
Serializers for shopping cart API.
"""

from rest_framework import serializers
from ..models import CartItem
from apps.products.api.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """
    Cart item serializer.
    """
    product = ProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value


class CartItemUpdateSerializer(serializers.ModelSerializer):
    """
    Cart item update serializer (for partial updates).
    """

    class Meta:
        model = CartItem
        fields = ['quantity']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value
