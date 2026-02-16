# 电商平台 MVP

基于 Django 4.2 + Next.js 14+ 的 B2C 电商平台 MVP 版本。

## 技术栈

### 后端
- Django 4.2
- Django REST Framework
- PostgreSQL 14
- Redis 7
- JWT 认证
- Celery（异步任务）

### 前端
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS（自定义组件）
- Axios + 自定义 hooks
- Zustand
- React Hook Form

## 快速开始

### 使用 Docker Compose（推荐）

1. 启动所有服务：
```bash
docker-compose up -d
```

2. 初始化数据库并生成测试数据：
```bash
make init-dev
```

3. 访问应用：
- 前端：http://localhost:3000
- 后端 API：http://localhost:8000/api/v1
- Django Admin：http://localhost:8000/admin

### 本地开发

#### 后端设置

1. 创建虚拟环境并安装依赖：
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. 配置环境变量（已提供默认配置）：
```bash
cp .env.example .env
```

3. 运行数据库迁移：
```bash
python manage.py migrate
```

4. 生成测试数据：
```bash
python manage.py generate_fake_data
```

5. 创建超级用户（可选）：
```bash
python manage.py createsuperuser
```

6. 启动开发服务器：
```bash
python manage.py runserver
```

#### 前端设置

1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:3000

## 功能特性

### 用户模块
- [x] 用户注册/登录
- [x] JWT 认证
- [x] 个人资料管理
- [x] 收货地址管理

### 商品模块
- [x] 商品分类（树形结构）
- [x] 商品列表（分页、搜索、筛选）
- [x] 商品详情
- [x] 热门商品推荐

### 购物车模块
- [x] 添加商品到购物车
- [x] 修改商品数量
- [x] 删除购物车商品
- [x] 购物车实时统计

### 订单模块
- [x] 创建订单
- [x] 订单列表
- [x] 订单详情
- [x] 取消订单

## 测试数据

项目包含一个 Faker 数据生成脚本，可以创建：
- 3 个一级分类，每个包含 2-3 个子分类
- 每个子分类 5-10 个商品
- 10 个测试用户
- 每个用户 1-2 个收货地址
- 随机购物车数据

测试用户的默认密码：`password123`

## API 文档

### 认证接口
- `POST /api/v1/auth/register/` - 用户注册
- `POST /api/v1/auth/login/` - 用户登录
- `GET /api/v1/auth/me/` - 获取当前用户
- `POST /api/v1/auth/refresh/` - 刷新 Token

### 商品接口
- `GET /api/v1/products/` - 商品列表
- `GET /api/v1/products/featured/` - 热门商品
- `GET /api/v1/products/{id}/` - 商品详情
- `GET /api/v1/categories/` - 分类列表

### 购物车接口
- `GET /api/v1/cart/` - 获取购物车
- `POST /api/v1/cart/items/` - 添加商品
- `PATCH /api/v1/cart/items/{id}/` - 修改数量
- `DELETE /api/v1/cart/items/{id}/` - 删除商品

### 订单接口
- `POST /api/v1/orders/create/` - 创建订单
- `GET /api/v1/orders/` - 订单列表
- `GET /api/v1/orders/{id}/` - 订单详情
- `POST /api/v1/orders/{id}/cancel/` - 取消订单

## 项目结构

```
ecommerce/
├── backend/                 # Django 后端
│   ├── config/             # Django 配置
│   ├── apps/               # 应用模块
│   │   ├── users/          # 用户模块
│   │   ├── products/       # 商品模块
│   │   ├── cart/           # 购物车模块
│   │   └── orders/         # 订单模块
│   ├── core/               # 核心工具
│   ├── requirements/       # Python 依赖
│   └── manage.py
├── frontend/               # Next.js 前端
│   ├── src/
│   │   ├── app/           # App Router 页面
│   │   ├── components/    # React 组件
│   │   ├── lib/           # API 客户端
│   │   ├── store/         # Zustand 状态管理
│   │   └── types/         # TypeScript 类型
│   └── package.json
├── docker-compose.yml      # Docker 编排
└── Makefile               # 开发命令
```

## 注意事项

1. 本项目为 MVP 版本，适用于学习和演示
2. 生产环境使用前请修改 `SECRET_KEY` 等敏感配置
3. 默认使用 PostgreSQL 数据库（Docker 环境）
4. 前端默认连接 http://localhost:8000/api/v1

## 后续开发建议

- [ ] 支付模块（支付宝/微信支付）
- [ ] 商品评价系统
- [ ] 优惠券系统
- [ ] 会员积分系统
- [ ] 搜索优化（Elasticsearch）
- [ ] 图片上传处理（阿里云OSS）
- [ ] 单元测试和集成测试
- [ ] CI/CD 配置

## License

MIT
