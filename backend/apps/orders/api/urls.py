"""
URL configuration for orders API.
"""

from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    cancel_order
)
from .payment_views import create_payment, simulate_payment, payment_status

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('orders/<uuid:id>/', OrderDetailView.as_view(), name='order_detail'),
    path('orders/<uuid:id>/cancel/', cancel_order, name='cancel_order'),
    path('orders/<uuid:order_id>/payment/', create_payment, name='create_payment'),
    path('orders/<uuid:order_id>/pay/', simulate_payment, name='simulate_payment'),
    path('orders/<uuid:order_id>/payment/status/', payment_status, name='payment_status'),
]
