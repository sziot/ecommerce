"""
API views for orders.
"""

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Order
from .serializers import OrderSerializer, CreateOrderSerializer


class OrderListView(generics.ListAPIView):
    """
    List current user's orders.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve order details.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderView(generics.CreateAPIView):
    """
    Create a new order from cart items.
    """
    serializer_class = CreateOrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, id):
    """
    Cancel an order (only pending orders).
    """
    from django.utils import timezone

    try:
        order = Order.objects.get(id=id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if order.status != 'pending':
        return Response(
            {'error': 'Only pending orders can be cancelled'},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = 'cancelled'
    order.cancelled_at = timezone.now()
    order.save()

    # Restore product stock (optional - if you want to implement stock management)

    return Response(OrderSerializer(order).data)
