"""
Serializers for orders API.
"""

from rest_framework import serializers
from ..models import Order, OrderItem
from apps.users.api.serializers import AddressSerializer
from apps.products.api.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Order item serializer.
    """
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_image',
            'price', 'quantity', 'subtotal'
        ]
        read_only_fields = ['id', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """
    Order serializer.
    """
    address = AddressSerializer(read_only=True)
    address_id = serializers.UUIDField(write_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_no', 'user', 'address', 'address_id',
            'total_amount', 'discount_amount', 'shipping_fee',
            'actual_amount', 'status', 'status_display', 'remarks',
            'paid_at', 'shipped_at', 'completed_at', 'cancelled_at',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = [
            'id', 'order_no', 'user', 'total_amount', 'actual_amount',
            'paid_at', 'shipped_at', 'completed_at', 'cancelled_at',
            'created_at', 'updated_at'
        ]


class CreateOrderSerializer(serializers.Serializer):
    """
    Create order serializer.
    """
    address_id = serializers.UUIDField(required=True)
    remarks = serializers.CharField(required=False, allow_blank=True)
    cart_item_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=True
    )

    def validate_address_id(self, value):
        from apps.users.models import Address
        try:
            address = Address.objects.get(id=value)
            if address.user != self.context['request'].user:
                raise serializers.ValidationError("Invalid address")
            return value
        except Address.DoesNotExist:
            raise serializers.ValidationError("Address not found")

    def validate_cart_item_ids(self, value):
        from apps.cart.models import CartItem
        user = self.context['request'].user
        cart_items = CartItem.objects.filter(
            id__in=value,
            user=user
        )
        if cart_items.count() != len(value):
            raise serializers.ValidationError("Some cart items are invalid")
        return value

    def create(self, validated_data):
        from apps.cart.models import CartItem
        from decimal import Decimal

        user = self.context['request'].user
        address_id = validated_data['address_id']
        remarks = validated_data.get('remarks', '')
        cart_item_ids = validated_data['cart_item_ids']

        # Get cart items
        cart_items = CartItem.objects.filter(id__in=cart_item_ids, user=user)

        # Calculate total amount
        total_amount = sum(item.subtotal for item in cart_items)

        # Create order
        order = Order.objects.create(
            user=user,
            address_id=address_id,
            total_amount=total_amount,
            actual_amount=total_amount,
            remarks=remarks
        )

        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_image=cart_item.product.main_image,
                price=cart_item.product.price,
                quantity=cart_item.quantity
            )

        # Clear cart items
        cart_items.delete()

        return order
