"""
Admin configuration for users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'nickname', 'email', 'phone', 'is_active', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'is_superuser']
    search_fields = ['username', 'nickname', 'email', 'phone']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'avatar', 'nickname')}),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'receiver_name', 'receiver_phone', 'province', 'city', 'is_default']
    list_filter = ['province', 'is_default']
    search_fields = ['receiver_name', 'receiver_phone', 'user__username']
    raw_id_fields = ['user']
