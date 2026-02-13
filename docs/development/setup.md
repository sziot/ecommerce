# 开发环境搭建指南

## 📋 环境要求

### 必需软件

- **Python:** 3.11+
- **Node.js:** 20+
- **PostgreSQL:** 14+
- **Redis:** 7+
- **Git:** 最新版本

### 推荐软件

- **Docker:** 24+
- **Docker Compose:** 2+
- **Postman:** API 测试
- **VS Code:** 代码编辑器

---

## 🔧 后端环境搭建

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce/backend
```

### 2. 创建虚拟环境

```bash
python -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. 安装依赖

```bash
pip install --upgrade pip
pip install -r requirements/development.txt
```

### 4. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填写配置信息
```

**.env 配置示例：**
```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ecommerce_dev
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Payment
ALIPAY_APP_ID=your-alipay-app-id
ALIPAY_APP_SECRET=your-alipay-secret
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-secret

# OSS
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-secret-key
OSS_BUCKET_NAME=your-bucket
OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
```

### 5. 初始化数据库

```bash
# 创建数据库
createdb ecommerce_dev

# 运行迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 加载测试数据（可选）
python manage.py loaddata seeds/*.json
```

### 6. 启动开发服务器

```bash
python manage.py runserver
```

访问：http://localhost:8000

### 7. 启动 Celery（新终端）

```bash
# Celery Worker
celery -A config worker -l info

# Celery Beat（定时任务）
celery -A config beat -l info
```

---

## 🎨 前端环境搭建 (Next.js)

### 1. 创建 Next.js 项目

```bash
# 进入项目目录
cd ecommerce

# 使用 create-next-app 创建项目
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir

# 或者手动创建
mkdir -p frontend
cd frontend
npm init -y
```

### 2. 安装依赖

```bash
cd frontend

# 安装核心依赖
npm install next@latest react@latest react-dom@latest

# 安装 TypeScript
npm install -D typescript @types/react @types/node

# 安装 Ant Design
npm install antd

# 安装状态管理
npm install zustand

# 安装数据请求
npm install @tanstack/react-query axios

# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 安装其他工具
npm install dayjs lodash
npm install -D @types/lodash eslint eslint-config-next
```

### 3. 配置环境变量

```bash
# 创建 .env.local
cat > .env.local << 'EOF'
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# 应用配置
NEXT_PUBLIC_APP_NAME=电商平台
NEXT_PUBLIC_UPLOAD_SIZE=5242880
EOF
```

### 4. 配置 Next.js

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-domain.com'],
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

### 5. 配置 TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

---

## 🐳 Docker 环境搭建（推荐）

### 1. 安装 Docker

参考：[Docker 官方文档](https://docs.docker.com/get-docker/)

### 2. 启动服务

```bash
# 在项目根目录
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 初始化数据库

```bash
# 进入后端容器
docker-compose exec backend bash

# 运行迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 加载测试数据
python manage.py loaddata seeds/*.json

# 退出容器
exit
```

### 4. 访问服务

- 前端：http://localhost:3000
- 后端 API：http://localhost:8000/api/v1
- Admin：http://localhost:8000/admin

---

## 🛠️ 开发工具配置

### VS Code 推荐插件

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "ms-vscode.live-server"
  ]
}
```

### Python 配置（.vscode/settings.json）

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.testing.pytestEnabled": true
}
```

### ESLint 配置（.eslintrc.cjs）

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  }
}
```

---

## 🧪 测试环境配置

### 后端测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest apps/users/tests/

# 生成覆盖率报告
pytest --cov=apps --cov-report=html
```

### 前端测试

```bash
# 单元测试 (Jest + React Testing Library)
npm run test

# E2E 测试 (Playwright)
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

---

## 📝 代码规范

### Python 代码规范

```bash
# 代码格式化
black .

# 代码检查
flake8 .

# 导入排序
isort .
```

### TypeScript 代码规范

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

---

## 🔍 调试技巧

### 后端调试

```python
# 在代码中使用断点
import pdb; pdb.set_trace()

# 或使用 ipdb（更强大）
import ipdb; ipdb.set_trace()

# VS Code 调试配置
# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Django",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/manage.py",
      "args": ["runserver", "--noreload"],
      "django": true
    }
  ]
}
```

### 前端调试

```javascript
// 在代码中使用 console
console.log('Debug info');
console.error('Error');
console.table(data);

// 使用 Vue DevTools
// 浏览器扩展安装
```

---

## 📚 常用命令

### 后端

```bash
# 运行服务器
python manage.py runserver

# 创建迁移
python manage.py makemigrations

# 应用迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# Django Shell
python manage.py shell

# 收集静态文件
python manage.py collectstatic

# 检查代码
python manage.py check
```

### 前端 (Next.js)

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### Docker

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 进入容器
docker-compose exec backend bash

# 重新构建
docker-compose build

# 清理
docker-compose down -v
```

---

## ❓ 常见问题

### 1. 数据库连接失败

**问题：**`could not connect to server`

**解决：**
```bash
# 检查 PostgreSQL 是否运行
sudo service postgresql status

# 启动 PostgreSQL
sudo service postgresql start

# 或使用 Docker
docker-compose up -d db
```

### 2. Redis 连接失败

**问题：**`Error 111 connecting to redis`

**解决：**
```bash
# 启动 Redis
sudo service redis-server start

# 或使用 Docker
docker-compose up -d redis
```

### 3. 前端安装依赖失败

**问题：**`npm install` 失败

**解决：**
```bash
# 清除缓存
npm cache clean --force

# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或使用 pnpm
npm install -g pnpm
pnpm install
```

### 4. CORS 错误

**问题：**前端请求后端 API 跨域

**解决：**
```python
# backend/config/settings/development.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

---

## 📖 下一步

- 阅读 [API 文档](../api/api_reference.md)
- 查看 [数据库设计](../database/design.md)
- 了解 [部署流程](../deployment/deployment_guide.md)

---

**文档版本：** v1.0
**最后更新：** 2026-02-07
