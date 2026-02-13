"""
Generate fake data for development and testing.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
import random
from decimal import Decimal
from apps.users.models import Address
from apps.products.models import Category, Product, ProductImage
from apps.cart.models import CartItem

User = get_user_model()
fake = Faker(['zh_CN'])


class Command(BaseCommand):
    help = 'Generate fake data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create',
        )
        parser.add_argument(
            '--categories',
            type=int,
            default=3,
            help='Number of top-level categories to create',
        )
        parser.add_argument(
            '--products',
            type=int,
            default=50,
            help='Number of products to create per subcategory',
        )

    def handle(self, *args, **options):
        num_users = options['users']
        num_categories = options['categories']
        num_products = options['products']

        self.stdout.write(self.style.SUCCESS('Starting data generation...'))

        # Generate categories
        self.stdout.write('Generating categories...')
        categories = self.generate_categories(num_categories)

        # Generate users
        self.stdout.write(f'Generating {num_users} users...')
        users = self.generate_users(num_users)

        # Generate products
        self.stdout.write(f'Generating products...')
        self.generate_products(categories, num_products)

        # Generate some cart items
        self.stdout.write('Generating cart items...')
        self.generate_cart_items(users)

        self.stdout.write(self.style.SUCCESS('Data generation completed!'))

    def generate_categories(self, num_categories):
        """Generate category tree structure."""
        category_data = [
            {
                'name': '电子产品',
                'icon': '📱',
                'subcategories': ['手机', '电脑', '平板', '耳机', '智能手表']
            },
            {
                'name': '服装鞋帽',
                'icon': '👕',
                'subcategories': ['男装', '女装', '运动鞋', '箱包', '配饰']
            },
            {
                'name': '家居用品',
                'icon': '🏠',
                'subcategories': ['厨房用品', '卫浴用品', '家具', '家纺', '装饰']
            },
            {
                'name': '食品饮料',
                'icon': '🍔',
                'subcategories': ['零食', '饮料', '生鲜', '粮油', '调味品']
            },
            {
                'name': '图书文具',
                'icon': '📚',
                'subcategories': ['文学', '教材', '办公用品', '美术用品', '数码配件']
            },
            {
                'name': '美妆护肤',
                'icon': '💄',
                'subcategories': ['面部护理', '彩妆', '香水', '美妆工具', '身体护理']
            },
        ]

        categories = []
        for cat_data in category_data[:num_categories]:
            # Create parent category
            parent = Category.objects.create(
                name=cat_data['name'],
                icon=cat_data['icon'],
                image=f'https://placehold.co/400x300/e2e8f0/64748b?text={cat_data["name"]}',
                description=fake.text(max_nb_chars=200),
                order=random.randint(1, 10)
            )
            categories.append(parent)

            # Create subcategories
            for sub_name in cat_data['subcategories']:
                sub = Category.objects.create(
                    name=sub_name,
                    parent=parent,
                    image=f'https://placehold.co/400x300/e2e8f0/64748b?text={sub_name}',
                    description=fake.text(max_nb_chars=200),
                    order=random.randint(1, 10)
                )
                categories.append(sub)

        return Category.objects.filter(level=1)  # Return subcategories

    def generate_users(self, num_users):
        """Generate users with addresses."""
        users = []
        provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省']

        for i in range(num_users):
            # Create user
            user = User.objects.create_user(
                username=fake.user_name() + str(random.randint(1000, 9999)),
                email=fake.email(),
                password='password123',
                nickname=fake.name(),
                phone=fake.phone_number()[:11]
            )
            users.append(user)

            # Create 1-2 addresses for each user
            for _ in range(random.randint(1, 2)):
                province = random.choice(provinces)
                city = fake.city_name()
                district = fake.street_name()

                Address.objects.create(
                    user=user,
                    receiver_name=fake.name(),
                    receiver_phone=fake.phone_number()[:11],
                    province=province,
                    city=city,
                    district=district,
                    detail=fake.street_address(),
                    postal_code=fake.postcode(),
                    is_default=random.choice([True, False])
                )

        return users

    def generate_products(self, categories, num_products):
        """Generate products for each category."""
        product_names = {
            '手机': ['iPhone 15 Pro', '华为 Mate 60', '小米 14', 'OPPO Find X7', 'vivo X100'],
            '电脑': ['MacBook Pro', '联想 ThinkPad', '戴尔 XPS', '华硕 ROG', 'HP 暗影精灵'],
            '平板': ['iPad Pro', '华为 MatePad', '小米平板 6', 'Surface Pro', '三星 Galaxy Tab'],
            '耳机': ['AirPods Pro', '索尼 WH-1000XM5', 'Bose QC45', '华为 FreeBuds', '小米耳机'],
            '智能手表': ['Apple Watch', '华为 Watch GT', '小米 Watch S3', 'Garmin Forerunner', '三星 Galaxy Watch'],
            '男装': ['商务衬衫', '休闲T恤', '牛仔裤', '西装外套', '运动裤'],
            '女装': ['连衣裙', '针织衫', '半身裙', '外套', '打底裤'],
            '运动鞋': ['Nike Air Max', 'Adidas Ultraboost', '李宁超轻', '安踏KT', 'New Balance 574'],
            '箱包': ['双肩包', '公文包', '手提包', '旅行箱', '斜挎包'],
            '配饰': ['皮带', '钱包', '领带', '围巾', '帽子'],
            '厨房用品': ['不粘锅', '刀具套装', '保鲜盒', '厨房剪刀', '砧板'],
            '卫浴用品': ['毛巾套装', '浴巾', '洗漱杯', '牙刷架', '浴室置物架'],
            '家具': ['沙发', '床', '书桌', '餐椅', '茶几'],
            '家纺': ['四件套', '枕头', '被子', '毛毯', '蚊帐'],
            '装饰': ['挂画', '摆件', '花瓶', '时钟', '装饰灯'],
            '零食': ['薯片', '饼干', '坚果', '糖果', '巧克力'],
            '饮料': ['果汁', '苏打水', '茶饮', '咖啡', '功能饮料'],
            '生鲜': ['水果', '蔬菜', '肉类', '海鲜', '蛋类'],
            '粮油': ['大米', '面粉', '食用油', '杂粮', '调味料'],
            '调味品': ['酱油', '醋', '盐', '糖', '香料'],
            '文学': ['小说', '散文', '诗歌', '传记', '名著'],
            '教材': ['数学', '英语', '物理', '化学', '历史'],
            '办公用品': ['笔记本', '签字笔', '文件夹', '订书机', '计算器'],
            '美术用品': ['画笔', '颜料', '画纸', '画板', '素描工具'],
            '数码配件': ['数据线', '充电器', '移动电源', '支架', '贴膜'],
            '面部护理': ['洗面奶', '爽肤水', '乳液', '精华液', '面霜'],
            '彩妆': ['口红', '粉底液', '眼影', '睫毛膏', '腮红'],
            '香水': ['女式香水', '男士香水', '中性香水', '迷你香水', '香水套装'],
            '美妆工具': ['化妆刷', '美妆蛋', '睫毛夹', '修眉刀', '粉扑'],
            '身体护理': ['沐浴露', '身体乳', '磨砂膏', '护手霜', '润唇膏'],
        }

        for category in categories:
            # Get predefined names or generate random ones
            names = product_names.get(category.name, [f'{category.name}商品{i}' for i in range(1, 11)])

            for i, name in enumerate(names[:num_products]):
                price = Decimal(str(random.uniform(50, 5000)))
                original_price = price * Decimal(str(random.uniform(1.1, 1.5))) if random.choice([True, False]) else None
                stock = random.randint(0, 500)
                sales = random.randint(0, 1000)

                product = Product.objects.create(
                    name=name,
                    description=fake.text(max_nb_chars=500),
                    price=price.quantize(Decimal('0.01')),
                    original_price=original_price.quantize(Decimal('0.01')) if original_price else None,
                    stock=stock,
                    sales=sales,
                    category=category,
                    main_image=f'https://placehold.co/800x800/f3f4f6/1f2937?text={name}',
                    is_featured=random.choice([True, False]) and sales > 100,
                    weight=Decimal(str(random.uniform(0.1, 10))).quantize(Decimal('0.1')),
                    specifications={
                        'brand': fake.company(),
                        'model': f'Model-{random.randint(1000, 9999)}',
                        'origin': random.choice(['国产', '进口', '合资']),
                        'warranty': f'{random.randint(1, 3)}年'
                    }
                )

                # Add product images
                for j in range(random.randint(2, 5)):
                    ProductImage.objects.create(
                        product=product,
                        image=f'https://placehold.co/800x800/f3f4f6/1f2937?text={name}-{j+1}',
                        order=j
                    )

    def generate_cart_items(self, users):
        """Generate random cart items for users."""
        products = list(Product.objects.filter(is_active=True, stock__gt=0))

        for user in users[:len(users)//2]:  # Only for half of users
            num_items = random.randint(1, 5)
            selected_products = random.sample(products, min(num_items, len(products)))

            for product in selected_products:
                quantity = random.randint(1, min(3, product.stock))
                CartItem.objects.get_or_create(
                    user=user,
                    product=product,
                    defaults={'quantity': quantity}
                )
