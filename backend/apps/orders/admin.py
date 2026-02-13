"""
Admin configuration for orders app.
"""

from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']
    fields = ['product', 'product_name', 'product_image', 'price', 'quantity', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_no', 'user', 'total_amount', 'actual_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_no', 'user__username', 'user__email']
    readonly_fields = ['order_no', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'order_no', 'address')
        }),
        ('Amount', {
            'fields': ('total_amount', 'discount_amount', 'shipping_fee', 'actual_amount')
        }),
        ('Status', {
            'fields': ('status', 'remarks')
        }),
        ('Timestamps', {
            'fields': ('paid_at', 'shipped_at', 'completed_at', 'cancelled_at', 'created_at', 'updated_at')
        }),
    )
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'price', 'quantity', 'subtotal']
    list_filter = ['order__status']
    search_fields = ['order__order_no', 'product_name']
    readonly_fields = ['subtotal']
