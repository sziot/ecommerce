"""
API views for products app.
"""

from rest_framework import generics, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAdminUser
from ..models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer
)


class CategoryListView(generics.ListAPIView):
    """
    List all categories (tree structure).
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    """
    Retrieve a category with its products.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class ProductListView(generics.ListAPIView):
    """
    List all products with filtering and search.
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'sales', 'created_at']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a product detail.
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class FeaturedProductsView(generics.ListAPIView):
    """
    List featured products.
    """
    queryset = Product.objects.filter(is_active=True, is_featured=True)[:8]
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    ordering = ['-sales']

    def list(self, request, *args, **kwargs):
        """
        Override list to return products directly without pagination
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
