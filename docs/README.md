# 电商平台项目 - 文档索引

> 基于 Django + Vue 3 的完整电商解决方案

## 📚 文档导航

### 📖 项目概述
- [项目总体规划](project/overview.md) - 项目目标、功能模块、非功能需求
- [技术架构设计](project/architecture.md) - 系统架构、技术选型、核心模块设计
- [前端技术选型](project/react_vs_vue.md) - React vs Vue 对比及选择理由
- [文件结构说明](project/file_structure.md) - 完整的项目文件结构（React + Next.js）

### 🔧 开发文档
- [开发流程规划](development/roadmap.md) - 完整的开发流程和时间线
- [环境搭建指南](development/setup.md) - 开发环境配置步骤

### 🌐 API 文档
- [API 接口文档](api/api_reference.md) - RESTful API 详细说明

### 🗄️ 数据库文档
- [数据库设计](database/design.md) - 数据库模型和关系

### 🚀 部署文档
- [部署指南](deployment/deployment_guide.md) - 生产环境部署流程

---

## 🎯 快速开始

### 1. 环境要求
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+
- Redis 7+

### 2. 快速启动

#### 使用 Docker（推荐）
```bash
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce
docker-compose up -d
```

#### 手动安装
```bash
# 后端
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py runserver

# 前端
cd frontend
npm install
npm run dev
```

### 3. 访问地址
- 前端：http://localhost:5173
- 后端 API：http://localhost:8000/api/v1
- Admin：http://localhost:8000/admin

---

## 📊 项目进度

### ✅ 已完成
- [x] 项目规划
- [x] 技术选型
- [x] 架构设计
- [x] 文档编写

### 🚧 进行中
- [ ] 环境搭建
- [ ] 基础框架开发

### 📅 待开始
- [ ] 核心功能开发
- [ ] 测试
- [ ] 部署上线

---

## 🛠️ 技术栈

### 后端
- **框架：** Django 4.2
- **API：** Django REST Framework
- **数据库：** PostgreSQL 14
- **缓存：** Redis 7
- **异步：** Celery

### 前端
- **框架：** React 18+
- **全栈框架：** Next.js 14+ (App Router)
- **语言：** TypeScript 5.0+
- **状态管理：** Zustand / Redux Toolkit
- **UI 库：** Ant Design
- **数据请求：** TanStack Query (React Query)
- **样式：** Tailwind CSS

### 部署
- **容器：** Docker
- **Web 服务器：** Nginx
- **进程管理：** PM2

---

## 📞 联系方式

- **项目负责人：** [您的名字]
- **邮箱：** [your-email@example.com]
- **GitHub：** [https://github.com/your-repo/ecommerce]

---

## 📄 许可证

MIT License

---

**最后更新：** 2026-02-07
**文档版本：** v1.1
**技术栈：** Django + React + Next.js
