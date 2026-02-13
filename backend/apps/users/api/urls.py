"""
URL configuration for users API.
"""

from django.urls import path
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    current_user,
    update_profile,
    AddressListCreateView,
    AddressDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('me/', current_user, name='current_user'),
    path('me/update/', update_profile, name='update_profile'),
    path('addresses/', AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<uuid:id>/', AddressDetailView.as_view(), name='address_detail'),
]
