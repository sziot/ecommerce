# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个规划中的 B2C 电商平台项目，目前处于文档和规划阶段。项目已采用 Django 4.2 + Next.js 14+ 架构设计，但尚未开始实际编码实现。项目拥有完善的技术规格说明和详细的开发路线图。

## 技术栈

### 后端
- **框架**: Django 4.2 + Django REST Framework
- **数据库**: PostgreSQL 14
- **缓存**: Redis 7
- **任务队列**: Celery + Redis
- **认证**: JWT Token
- **搜索**: Elasticsearch（可选）

### 前端
- **框架**: React 18+（近期从 Vue 3 更换而来）
- **全栈框架**: Next.js 14+（使用 App Router）
- **语言**: TypeScript 5.0+
- **状态管理**: Zustand
- **UI 样式**: Tailwind CSS（完全自定义组件）
- **数据请求**: Axios + 自定义 hooks
- **表单处理**: React Hook Form
- **样式工具**: clsx / class-variance-authority

### DevOps & 部署
- **容器化**: Docker
- **编排工具**: Docker Compose
- **Web 服务器**: Nginx
- **进程管理**: PM2

## 命令

### 开发命令
```bash
# 安装所有依赖
make install

# 启动完整开发环境
make dev

# 仅启动后端
make dev-backend

# 仅启动前端
make dev-frontend

# 运行测试
make test

# 仅运行后端测试
make test-backend

# 仅运行前端测试
make test-frontend

# 构建生产版本
make build

# 运行数据库迁移
make migrate

# 创建超级用户
make createsuperuser

# 查看日志
make logs

# 备份数据库
make backup

# 恢复数据库（用法：make restore FILE=backup.sql）
make restore
```

### Docker 命令
```bash
# 启动开发环境
docker-compose up

# 停止并删除容器
docker-compose down

# 构建并启动生产环境
make deploy
```

## 架构概览

### 系统架构
系统采用单体架构，前后端清晰分离：

1. **前端服务器**: Next.js 提供面向用户的页面（SSR/SSG/ISR）
2. **API 服务器**: Django REST API 后端
3. **后台管理服务器**: Next.js 管理后台

### 核心模块（规划中）
- **用户管理**: 注册、认证、个人资料、收货地址
- **商品管理**: 分类、规格、库存、搜索
- **购物车**: 基于 Redis 缓存的实时购物车管理
- **订单处理**: 订单创建、状态跟踪、物流
- **支付集成**: 支付宝、微信支付、Stripe
- **营销功能**: 优惠券、促销活动、积分
- **评价与评分**: 支持图片的商品评价
- **数据分析**: 销售数据、用户行为分析

### 数据流向
1. 用户请求通过 Nginx 负载均衡器
2. 前端由 Next.js 提供服务（SSR/SSG 用于 SEO）
3. API 请求由 Django REST Framework 处理
4. 数据通过 Redis 缓存提升性能
5. PostgreSQL 作为主数据库
6. Celery 处理异步任务（订单处理、邮件发送）

### 访问地址（实现后）
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000/api/v1
- 管理后台: http://localhost:8000/admin

## 开发环境搭建

### 前置要求
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose

### Docker 快速启动
```bash
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce
docker-compose up -d
```

### 手动搭建
```bash
# 后端
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 前端
cd frontend
npm install
npm run dev
```

## 关键架构决策

### 后端架构
- **Django 4.2**: 因其成熟稳定、生态完善、开发效率高而被选中
- **JWT 认证**: 无状态认证，支持 Token 刷新机制
- **PostgreSQL**: 因其支持 JSON 类型和全文搜索功能而被选中
- **Redis**: 用于缓存、会话存储和消息队列
- **Celery**: 处理订单、邮件等异步任务

### 前端架构
- **Next.js 14+ (App Router)**: 现代路由系统，支持 SSR/SSG/ISR
- **TypeScript**: 类型安全和更好的 IDE 支持
- **Zustand**: 轻量级状态管理，用于全局状态（用户、购物车等）
- **Tailwind CSS**: 实用优先的 CSS 框架，配合自定义组件实现设计系统
- **Axios**: HTTP 客户端，配合自定义 hooks 实现数据请求层
- **React Hook Form**: 高性能表单处理，配合 Zod 进行验证
- **自定义组件库**: 基于 Tailwind CSS 构建的可复用组件

### 性能优化
- **前端**: 代码分割、图片优化、CDN、缓存
- **后端**: Redis 缓存、数据库索引、查询优化
- **数据库**: 读写分离、查询优化
- **CDN**: 静态资源分发和 API 缓存

## 数据库设计

### 核心数据表（规划中）
- `users`: 用户账户和个人资料
- `categories`: 商品分类树形结构
- `products`: 商品信息及规格
- `products_images`: 商品图片库
- `orders`: 订单主表信息
- `order_items`: 订单明细
- `cart_items`: 购物车内容
- `payments`: 支付记录
- `coupons`: 优惠券和促销码
- `reviews`: 商品评价和评分

## API 设计

### RESTful API 结构
- 基础 URL: `/api/v1/`
- 认证方式: JWT Bearer Token
- 响应格式: JSON，统一结构

### 主要 API 端点（规划中）
- `/auth/`: 用户认证和注册
- `/products/`: 商品 CRUD 和搜索
- `/cart/`: 购物车操作
- `/orders/`: 订单管理
- `/payment/`: 支付处理
- `/users/`: 用户资料管理

## 开发进度

本项目目前处于 14-20 周开发周期的第 1-2 阶段：
- ✅ 项目规划（第 1-2 周）
- ✅ 技术架构设计（第 3-5 周）
- 🚧 环境搭建和基础开发（第 6-13 周）
- 📋 测试阶段（第 14-16 周）
- 📋 部署上线（第 17-18 周）

## 重要说明

1. **尚未编码**: 这是一个仅包含文档的代码库，所有源代码目录（backend/、frontend/ 等）都需要创建。

2. **技术栈变更**: 项目最初设计使用 Vue 3，但近期改为 React + Next.js 以获得更好的 SEO 和性能。

3. **单体设计**: 虽然采用了现代化的前后端分离，但后端仍遵循单体架构模式，使用 Django 内置的应用结构。

4. **可扩展性**: 架构支持通过容器化和负载均衡实现水平扩展。

5. **安全性**: 已规划 JWT 认证、CORS/CSRF 防护、bcrypt 密码加密和 SQL 注入防护。
