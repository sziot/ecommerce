"""
Payment API views.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
import random
import string
from ..models import Order


def generate_payment_no():
    """Generate a unique payment number."""
    import time
    timestamp = str(int(time.time()))
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f'PAY{timestamp}{random_str}'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request, order_id):
    """
    Create a payment for an order.
    """
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': '订单不存在'},
            status=status.HTTP_404_NOT_FOUND
        )

    if order.status != 'pending':
        return Response(
            {'error': '订单状态不允许支付'},
            status=status.HTTP_400_BAD_REQUEST
        )

    payment_no = generate_payment_no()

    return Response({
        'payment_no': payment_no,
        'order_id': str(order.id),
        'order_no': order.order_no,
        'amount': float(order.actual_amount),
        'status': 'pending',
        'created_at': timezone.now().isoformat(),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_payment(request, order_id):
    """
    Simulate a payment for testing.
    """
    payment_method = request.data.get('payment_method', 'alipay')

    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': '订单不存在'},
            status=status.HTTP_404_NOT_FOUND
        )

    if order.status != 'pending':
        return Response(
            {'error': '订单状态不允许支付'},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = 'paid'
    order.paid_at = timezone.now()
    order.save()

    return Response({
        'success': True,
        'message': '支付成功',
        'order_id': str(order.id),
        'order_no': order.order_no,
        'amount': float(order.actual_amount),
        'paid_at': order.paid_at.isoformat(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, order_id):
    """
    Get payment status for an order.
    """
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': '订单不存在'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        'order_id': str(order.id),
        'order_no': order.order_no,
        'status': order.status,
        'amount': float(order.actual_amount),
        'paid_at': order.paid_at.isoformat() if order.paid_at else None,
    })
