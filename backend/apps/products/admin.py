"""
Admin configuration for products app.
"""

from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'order', 'alt_text']


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ['name', 'parent', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'original_price', 'stock', 'sales', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = []
    inlines = [ProductImageInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'category', 'description', 'main_image')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'cost_price')
        }),
        ('Inventory', {
            'fields': ('stock', 'sales')
        }),
        ('Settings', {
            'fields': ('is_active', 'is_featured', 'weight', 'specifications')
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image', 'order']
    list_filter = ['product']
    search_fields = ['product__name']
