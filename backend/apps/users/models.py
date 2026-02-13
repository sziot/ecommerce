"""
User models.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


def user_avatar_path(instance, filename):
    """Upload path for user avatars."""
    return f'avatars/user_{instance.id}/{filename}'


class User(AbstractUser):
    """
    Custom user model with additional fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=11, blank=True, null=True, verbose_name='手机号')
    avatar = models.URLField(blank=True, null=True, verbose_name='头像')
    nickname = models.CharField(max_length=50, blank=True, null=True, verbose_name='昵称')

    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return self.nickname or self.username or str(self.id)


class Address(models.Model):
    """
    User address model.
    """
    PROVINCE_CHOICES = [
        ('北京市', '北京市'),
        ('上海市', '上海市'),
        ('广东省', '广东省'),
        ('浙江省', '浙江省'),
        ('江苏省', '江苏省'),
        ('四川省', '四川省'),
        ('湖北省', '湖北省'),
        ('湖南省', '湖南省'),
        ('河南省', '河南省'),
        ('山东省', '山东省'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses',
        verbose_name='用户'
    )
    receiver_name = models.CharField(max_length=50, verbose_name='收货人姓名')
    receiver_phone = models.CharField(max_length=11, verbose_name='收货人电话')
    province = models.CharField(max_length=50, verbose_name='省份')
    city = models.CharField(max_length=50, verbose_name='城市')
    district = models.CharField(max_length=50, verbose_name='区/县')
    detail = models.CharField(max_length=200, verbose_name='详细地址')
    postal_code = models.CharField(max_length=10, blank=True, null=True, verbose_name='邮政编码')
    is_default = models.BooleanField(default=False, verbose_name='是否默认')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'addresses'
        verbose_name = '收货地址'
        verbose_name_plural = '收货地址'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f'{self.receiver_name} - {self.province}{self.city}{self.district}'

    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            Address.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)
