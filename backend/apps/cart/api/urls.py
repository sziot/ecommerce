"""
URL configuration for shopping cart API.
"""

from django.urls import path
from .views import (
    cart_summary,
    add_to_cart,
    CartItemDetailView,
    clear_cart
)

urlpatterns = [
    path('cart/', cart_summary, name='cart_summary'),
    path('cart/items/', add_to_cart, name='add_to_cart'),
    path('cart/items/<uuid:id>/', CartItemDetailView.as_view(), name='cart_item_detail'),
    path('cart/clear/', clear_cart, name='clear_cart'),
]
