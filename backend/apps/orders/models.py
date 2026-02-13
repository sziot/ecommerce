"""
Order models.
"""

from django.db import models
import uuid
from apps.users.models import User, Address
from apps.products.models import Product


class Order(models.Model):
    """
    Order model.
    """
    STATUS_CHOICES = [
        ('pending', '待支付'),
        ('paid', '已支付'),
        ('shipped', '已发货'),
        ('completed', '已完成'),
        ('cancelled', '已取消'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='用户'
    )
    order_no = models.CharField(max_length=50, unique=True, verbose_name='订单号')
    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='收货地址'
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='订单总额')
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='优惠金额'
    )
    shipping_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='运费'
    )
    actual_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='实付金额')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='订单状态'
    )
    remarks = models.TextField(blank=True, null=True, verbose_name='备注')
    paid_at = models.DateTimeField(null=True, blank=True, verbose_name='支付时间')
    shipped_at = models.DateTimeField(null=True, blank=True, verbose_name='发货时间')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='完成时间')
    cancelled_at = models.DateTimeField(null=True, blank=True, verbose_name='取消时间')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'orders'
        verbose_name = '订单'
        verbose_name_plural = '订单'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_no']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f'{self.order_no} - {self.user.username}'

    def save(self, *args, **kwargs):
        # Generate order number if not exists
        if not self.order_no:
            import random
            import time
            timestamp = str(int(time.time()))[-6:]
            random_str = str(random.randint(100, 999))
            self.order_no = f'ORD{timestamp}{random_str}'
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """
    Order item model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='订单'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name='商品'
    )
    product_name = models.CharField(max_length=200, verbose_name='商品名称')
    product_image = models.URLField(verbose_name='商品图片')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='商品单价')
    quantity = models.IntegerField(verbose_name='数量')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='小计')

    class Meta:
        db_table = 'order_items'
        verbose_name = '订单明细'
        verbose_name_plural = '订单明细'

    def __str__(self):
        return f'{self.order.order_no} - {self.product_name} x {self.quantity}'

    def save(self, *args, **kwargs):
        # Calculate subtotal
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)
