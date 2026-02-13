"""
API views for shopping cart.
"""

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import CartItem
from apps.products.models import Product
from .serializers import CartItemSerializer, CartItemUpdateSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_summary(request):
    """
    Get current user's cart summary.
    """
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')
    serializer = CartItemSerializer(cart_items, many=True)

    # Calculate totals
    total_items = sum(item.quantity for item in cart_items)
    total_amount = sum(item.subtotal for item in cart_items)

    return Response({
        'items': serializer.data,
        'total_items': total_items,
        'total_amount': total_amount
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """
    Add a product to cart or update quantity if already exists.
    """
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)

    if not product_id:
        return Response(
            {'error': 'product_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate product exists and is active
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found or not active'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check stock
    if product.stock < quantity:
        return Response(
            {'error': f'Only {product.stock} items available in stock'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get or create cart item
    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'quantity': quantity}
    )

    if not created:
        # Update quantity if item already exists
        cart_item.quantity += quantity
        if cart_item.quantity > product.stock:
            return Response(
                {'error': f'Only {product.stock} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        cart_item.save()

    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a cart item.
    """
    serializer_class = CartItemUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CartItemUpdateSerializer
        return CartItemSerializer


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    """
    Clear all items from cart.
    """
    CartItem.objects.filter(user=request.user).delete()
    return Response({'message': 'Cart cleared successfully'})
