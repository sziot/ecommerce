"""
URL configuration for products API.
"""

from django.urls import path
from .views import (
    CategoryListView,
    CategoryDetailView,
    ProductListView,
    ProductDetailView,
    FeaturedProductsView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('categories/<uuid:id>/', CategoryDetailView.as_view(), name='category_detail'),
    path('products/featured/', FeaturedProductsView.as_view(), name='featured_products'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<uuid:id>/', ProductDetailView.as_view(), name='product_detail'),
]
