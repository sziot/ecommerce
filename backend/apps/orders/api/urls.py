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

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('orders/<uuid:id>/', OrderDetailView.as_view(), name='order_detail'),
    path('orders/<uuid:id>/cancel/', cancel_order, name='cancel_order'),
]
