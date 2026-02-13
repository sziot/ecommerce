"""
Serializers for products API.
"""

from rest_framework import serializers
from ..models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer.
    """
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'parent', 'image', 'icon', 'description',
            'order', 'is_active', 'children', 'product_count'
        ]
        read_only_fields = ['id']

    def get_children(self, obj):
        # Get immediate children
        children = obj.get_children()
        if children.exists():
            return CategorySerializer(children, many=True).data
        return []

    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Product image serializer.
    """

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order', 'alt_text']
        read_only_fields = ['id']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Product list serializer (minimal data).
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'original_price', 'discount_percent',
            'main_image', 'stock', 'sales', 'category_name', 'is_featured'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Product detail serializer.
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'original_price',
            'cost_price', 'discount_percent', 'stock', 'in_stock',
            'sales', 'category', 'category_id', 'main_image', 'images',
            'is_active', 'is_featured', 'weight', 'specifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sales', 'created_at', 'updated_at']

    def get_in_stock(self, obj):
        return obj.stock > 0
