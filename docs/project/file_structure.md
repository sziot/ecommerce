# 项目文件结构

## 📁 根目录结构

```
ecommerce/
├── backend/                    # 后端项目
├── frontend/                   # 前端项目
├── database/                   # 数据库相关
├── deployment/                 # 部署相关
├── docs/                       # 项目文档
├── design/                     # 设计资源
├── scripts/                    # 脚本工具
└── README.md                   # 项目说明
```

---

## 🔧 后端项目结构

```
backend/
├── apps/                       # 应用模块
│   ├── users/                  # 用户模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── filters.py
│   │   ├── admin.py
│   │   └── tests.py
│   │
│   ├── products/               # 商品模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── filters.py
│   │   ├── admin.py
│   │   └── tests.py
│   │
│   ├── cart/                   # 购物车模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── orders/                 # 订单模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── tests.py
│   │
│   ├── payment/                # 支付模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── tests.py
│   │
│   ├── coupons/                # 优惠券模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── reviews/                # 评价模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── analytics/              # 数据分析模块
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── services.py
│   │
│   └── search/                 # 搜索模块
│       ├── __init__.py
│       ├── views.py
│       ├── urls.py
│       └── documents.py
│
├── config/                     # 配置文件
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── core/                       # 核心功能
│   ├── __init__.py
│   ├── mixins.py
│   ├── permissions.py
│   ├── exceptions.py
│   ├── paginations.py
│   ├── validators.py
│   ├── utils.py
│   ├── constants.py
│   └── decorators.py
│
├── middleware/                 # 中间件
│   ├── __init__.py
│   ├── logging.py
│   ├── cors.py
│   └── throttle.py
│
├── services/                   # 业务服务层
│   ├── __init__.py
│   ├── user_service.py
│   ├── product_service.py
│   ├── order_service.py
│   ├── payment_service.py
│   ├── cart_service.py
│   └── notification_service.py
│
├── tasks/                      # Celery 任务
│   ├── __init__.py
│   ├── celery.py
│   ├── order_tasks.py
│   ├── payment_tasks.py
│   ├── notification_tasks.py
│   └── data_tasks.py
│
├── utils/                      # 工具类
│   ├── __init__.py
│   ├── jwt_utils.py
│   ├── payment_utils.py
│   ├── sms_utils.py
│   ├── email_utils.py
│   ├── oss_utils.py
│   ├── cache_utils.py
│   └── format_utils.py
│
├── tests/                      # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   └── factories/
│
├── static/                     # 静态文件
│   ├── css/
│   ├── js/
│   └── images/
│
├── media/                      # 媒体文件
│   ├── products/
│   ├── avatars/
│   └── documents/
│
├── locale/                     # 国际化
│   ├── zh_Hans/
│   └── en_US/
│
├── logs/                       # 日志文件
│   ├── django.log
│   ├── celery.log
│   └── error.log
│
├── requirements/               # 依赖文件
│   ├── base.txt
│   ├── development.txt
│   ├── production.txt
│   └── testing.txt
│
├── manage.py
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🎨 前端项目结构 (Next.js + React)

```
frontend/
├── public/                     # 公共资源
│   ├── favicon.ico
│   └── images/
│
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (auth)/             # 认证路由组
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/             # 主路由组
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # 商品列表
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # 商品详情
│   │   │   ├── cart/
│   │   │   │   └── page.tsx    # 购物车
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx    # 结算
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx    # 订单列表
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # 订单详情
│   │   │   └── user/
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       └── address/
│   │   │           └── page.tsx
│   │   │
│   │   ├── admin/              # 管理后台
│   │   │   ├── page.tsx        # 后台首页
│   │   │   ├── products/
│   │   │   └── orders/
│   │   │
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   └── route.ts
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx          # 根布局
│   │   ├── globals.css         # 全局样式
│   │   └── error.tsx           # 错误页面
│   │
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── BackToTop.tsx
│   │   │
│   │   ├── product/            # 商品组件
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── SpecSelector.tsx
│   │   │
│   │   ├── cart/               # 购物车组件
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartList.tsx
│   │   │   └── QuantitySelector.tsx
│   │   │
│   │   ├── order/              # 订单组件
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatus.tsx
│   │   │   └── LogisticsTrace.tsx
│   │   │
│   │   └── user/               # 用户组件
│   │       ├── UserAvatar.tsx
│   │       ├── AddressList.tsx
│   │       └── LoginForm.tsx
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProduct.ts
│   │   ├── useOrder.ts
│   │   ├── usePayment.ts
│   │   ├── usePagination.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/                  # Zustand 状态管理
│   │   ├── index.ts
│   │   ├── userStore.ts
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   │   └── orderStore.ts
│   │
│   ├── services/               # API 服务层
│   │   ├── api.ts              # Axios 配置
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── payment.ts
│   │
│   ├── types/                  # TypeScript 类型
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── common.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── storage.ts
│   │   ├── date.ts
│   │   └── constants.ts
│   │
│   ├── styles/                 # 样式文件
│   │   ├── globals.css
│   │   └── antd-overrides.css
│   │
│   └── lib/                    # 第三方库配置
│       ├── axios.ts
│       └── query-client.ts     # TanStack Query 配置
│
├── tests/                      # 测试
│   ├── unit/
│   └── e2e/
│
├── .env.local                  # 本地环境变量
├── .env.development
├── .env.production
├── next.config.js              # Next.js 配置
├── tsconfig.json
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🗄️ 数据库结构

```
database/
├── migrations/                 # 迁移文件
├── seeds/                      # 种子数据
├── schemas/                    # 数据库架构
│   ├── schema.sql
│   ├── tables.sql
│   ├── indexes.sql
│   ├── triggers.sql
│   └── procedures.sql
├── erd/                        # 实体关系图
│   ├── erd.png
│   └── erd.html
├── backups/                    # 备份
│   ├── backup.sh
│   └── restore.sh
└── docs/                       # 数据库文档
    ├── design.md
    ├── optimization.md
    └── migration_guide.md
```

---

## 🚀 部署结构

```
deployment/
├── docker/                     # Docker 配置
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── entrypoint.sh
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── nginx/                      # Nginx 配置
│   ├── nginx.conf
│   └── sites-available/
│
├── scripts/                    # 部署脚本
│   ├── deploy.sh
│   ├── rollback.sh
│   └── backup.sh
│
└── monitoring/                 # 监控配置
    ├── prometheus/
    └── grafana/
```

---

## 📚 文档结构

```
docs/
├── project/                    # 项目文档
│   ├── overview.md
│   ├── architecture.md
│   ├── tech_stack.md
│   └── roadmap.md
│
├── api/                        # API 文档
│   ├── api_reference.md
│   ├── authentication.md
│   ├── errors.md
│   └── rate_limiting.md
│
├── database/                   # 数据库文档
│   ├── schema.md
│   ├── erd.md
│   └── queries.md
│
├── development/                # 开发文档
│   ├── setup.md
│   ├── coding_standards.md
│   ├── testing.md
│   └── debugging.md
│
└── deployment/                 # 部署文档
    ├── deployment_guide.md
    ├── ci_cd.md
    └── troubleshooting.md
```

---

**文档版本：** v1.0
**最后更新：** 2026-02-07
