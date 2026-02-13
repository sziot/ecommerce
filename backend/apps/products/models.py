"""
Product models.
"""

from django.db import models
import uuid
from mptt.models import MPTTModel, TreeForeignKey


def category_image_path(instance, filename):
    """Upload path for category images."""
    return f'categories/{filename}'


def product_image_path(instance, filename):
    """Upload path for product images."""
    return f'products/product_{instance.product.id}/{filename}'


class Category(MPTTModel):
    """
    Category model with tree structure.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name='分类名称')
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='父分类'
    )
    image = models.URLField(blank=True, null=True, verbose_name='分类图片')
    icon = models.CharField(max_length=50, blank=True, null=True, verbose_name='图标')
    description = models.TextField(blank=True, null=True, verbose_name='描述')
    order = models.IntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class MPTTMeta:
        order_insertion_by = ['order', 'name']

    class Meta:
        db_table = 'categories'
        verbose_name = '商品分类'
        verbose_name_plural = '商品分类'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def get_ancestors_names(self):
        """Get all ancestor category names."""
        return ' > '.join([cat.name for cat in self.get_ancestors(include_self=True)])


class Product(models.Model):
    """
    Product model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name='商品名称')
    description = models.TextField(verbose_name='商品描述')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='现价')
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='原价'
    )
    cost_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='成本价'
    )
    stock = models.IntegerField(default=0, verbose_name='库存')
    sales = models.IntegerField(default=0, verbose_name='销量')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='分类'
    )
    main_image = models.URLField(verbose_name='主图')
    is_active = models.BooleanField(default=True, verbose_name='是否上架')
    is_featured = models.BooleanField(default=False, verbose_name='是否推荐')
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='重量(kg)'
    )
    specifications = models.JSONField(default=dict, blank=True, verbose_name='规格参数')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'products'
        verbose_name = '商品'
        verbose_name_plural = '商品'
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['-sales']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return self.name

    @property
    def discount_percent(self):
        """Calculate discount percentage."""
        if self.original_price and self.original_price > self.price:
            return int((self.original_price - self.price) / self.original_price * 100)
        return 0


class ProductImage(models.Model):
    """
    Product image model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='商品'
    )
    image = models.URLField(verbose_name='图片URL')
    order = models.IntegerField(default=0, verbose_name='排序')
    alt_text = models.CharField(max_length=200, blank=True, null=True, verbose_name='替代文本')

    class Meta:
        db_table = 'product_images'
        verbose_name = '商品图片'
        verbose_name_plural = '商品图片'
        ordering = ['order']

    def __str__(self):
        return f'{self.product.name} - Image {self.order}'
