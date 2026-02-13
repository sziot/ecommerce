# 部署指南

## 🎯 部署架构

### 生产环境架构图

```
Internet
    │
    ▼
[CDN] - 静态资源加速
    │
    ▼
[Nginx] - 负载均衡、反向代理
    │
    ├─▶ [前端服务器] × 2
    │       └─ Vue 3 静态文件
    │
    ├─▶ [API 服务器] × 2
    │       └─ Django + Gunicorn
    │
    ├─▶ [后台管理服务器] × 1
    │       └─ Vue 3 静态文件
    │
    ▼
[数据库主从]
    ├─ [主库] - 读写
    └─ [从库] - 只读

[Redis 集群]
    ├─ [主] - 读写
    └─ [从] - 读写

[Celery]
    ├─ [Worker] × 2 - 异步任务
    └─ [Beat] - 定时任务
```

---

## 🚀 服务器要求

### 最小配置（测试/小规模）

- **CPU:** 2 核
- **内存:** 4GB
- **磁盘:** 40GB SSD
- **带宽:** 5Mbps

### 推荐配置（生产环境）

- **CPU:** 4 核
- **内存:** 8GB
- **磁盘:** 100GB SSD
- **带宽:** 10Mbps

### 大规模配置

- **负载均衡:** 独立服务器（2核4G）
- **应用服务器:** × 3（4核8G）
- **数据库服务器:** 主从（8核16G）
- **Redis:** 主从（4核8G）

---

## 🐳 Docker 部署（推荐）

### 1. 准备工作

#### 安装 Docker 和 Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 克隆项目

```bash
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce
```

### 2. 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑生产环境配置
nano .env
```

**生产环境 .env 配置：**
```env
# Django
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ecommerce_prod
DB_USER=ecommerce_user
DB_PASSWORD=your-strong-password
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Payment（生产环境密钥）
ALIPAY_APP_ID=your-alipay-app-id
ALIPAY_APP_SECRET=your-alipay-secret
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-secret

# OSS
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-secret-key
OSS_BUCKET_NAME=your-bucket
OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

### 3. 配置 Nginx

**deployment/nginx/sites-available/frontend.conf:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Next.js 应用（通过 PM2 或 standalone）
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin 后台
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 媒体文件
    location /media/ {
        alias /var/www/media/;
    }

    # 静态文件
    location /static/ {
        alias /var/www/static/;
    }

    # Next.js 静态资源缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. SSL 证书配置（HTTPS）

#### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

### 5. 启动服务

```bash
# 构建镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 6. 初始化数据库

```bash
# 进入后端容器
docker-compose exec backend bash

# 运行迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 收集静态文件
python manage.py collectstatic --noinput

# 退出容器
exit
```

---

## 📦 传统部署方式

### 1. 安装系统依赖

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3.11 python3-pip postgresql postgresql-contrib nginx redis-server git
```

### 2. 配置 PostgreSQL

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE ecommerce_prod;
CREATE USER ecommerce_user WITH PASSWORD 'your-password';
ALTER ROLE ecommerce_user SET client_encoding TO 'utf8';
ALTER ROLE ecommerce_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ecommerce_user SET timezone TO 'Asia/Shanghai';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_prod TO ecommerce_user;
\q
```

### 3. 配置后端

```bash
# 克隆项目
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce/backend

# 创建虚拟环境
python3.11 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements/production.txt

# 配置环境变量
cp .env.example .env
nano .env

# 初始化数据库
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

### 4. 配置 Gunicorn

**创建 systemd 服务：**
```bash
sudo nano /etc/systemd/system/ecommerce.service
```

```ini
[Unit]
Description=Ecommerce Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ecommerce/backend
ExecStart=/var/www/ecommerce/backend/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 启动服务
sudo systemctl start ecommerce
sudo systemctl enable ecommerce
```

### 5. 配置前端

```bash
# 进入前端目录
cd ../frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# Next.js 输出：.next/ 和 public/
# 使用 PM2 启动或通过 Nginx 代理
```

### 6. 配置 Celery

```bash
sudo nano /etc/systemd/system/ecommerce-celery.service
```

```ini
[Unit]
Description=Ecommerce Celery Worker
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ecommerce/backend
ExecStart=/var/www/ecommerce/backend/venv/bin/celery -A config worker -l info
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start ecommerce-celery
sudo systemctl enable ecommerce-celery
```

---

## 🔒 安全配置

### 1. 防火墙配置

```bash
# 安装 UFW
sudo apt install ufw

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable
```

### 2. 限制 SSH 访问

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 禁用 root 登录
PermitRootLogin no

# 禁用密码登录（推荐使用密钥）
PasswordAuthentication no

# 重启 SSH
sudo systemctl restart ssh
```

### 3. 数据库安全

```bash
# PostgreSQL 只监听本地
sudo nano /etc/postgresql/14/main/postgresql.conf

listen_addresses = 'localhost'

# 设置防火墙
sudo ufw deny 5432
```

---

## 📊 监控配置

### 1. 日志管理

```bash
# 创建日志目录
sudo mkdir -p /var/log/ecommerce
sudo chown www-data:www-data /var/log/ecommerce

# 配置日志轮转
sudo nano /etc/logrotate.d/ecommerce
```

```
/var/log/ecommerce/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 2. 性能监控

#### 安装 Prometheus

```bash
sudo apt install prometheus
sudo systemctl start prometheus
sudo systemctl enable prometheus
```

#### 安装 Grafana

```bash
sudo apt install grafana
sudo systemctl start grafana
sudo systemctl enable grafana
```

访问：http://your-server:3000

---

## 🔄 CI/CD 配置

### GitHub Actions 示例

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/ecommerce
            git pull origin main
            docker-compose down
            docker-compose build
            docker-compose up -d
```

---

## 🔧 故障排查

### 常见问题

#### 1. 502 Bad Gateway

**原因：**后端服务未启动或崩溃

**解决：**
```bash
# 检查服务状态
sudo systemctl status ecommerce

# 查看日志
sudo journalctl -u ecommerce -f

# 重启服务
sudo systemctl restart ecommerce
```

#### 2. 数据库连接失败

**原因：**数据库未启动或配置错误

**解决：**
```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 检查连接
sudo -u postgres psql -c "SELECT version();"
```

#### 3. 静态文件 404

**原因：**未收集静态文件或权限错误

**解决：**
```bash
# 收集静态文件
python manage.py collectstatic --noinput

# 检查权限
sudo chown -R www-data:www-data /var/www/static/
```

---

## 📋 部署检查清单

### 上线前检查

- [ ] 环境变量配置正确
- [ ] 数据库迁移完成
- [ ] 静态文件收集
- [ ] SSL 证书配置
- [ ] 防火墙配置
- [ ] 日志系统配置
- [ ] 监控系统配置
- [ ] 备份系统配置
- [ ] 支付接口测试
- [ ] 第三方服务测试

### 上线后验证

- [ ] 首页可访问
- [ ] API 接口正常
- [ ] 用户注册/登录正常
- [ ] 商品浏览正常
- [ ] 购物车功能正常
- [ ] 下单支付正常
- [ ] 管理后台可访问
- [ ] 日志正常输出
- [ ] 监控正常工作

---

## 🔄 更新部署

### 滚动更新流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 备份当前版本
docker-compose exec backend python manage.py dumpdata > backup.json

# 3. 构建新镜像
docker-compose build

# 4. 重启服务（零停机）
docker-compose up -d --no-deps --build backend

# 5. 运行迁移
docker-compose exec backend python manage.py migrate

# 6. 清理旧镜像
docker image prune -f
```

### 回滚流程

```bash
# 1. 恢复备份
docker-compose exec backend python manage.py loaddata backup.json

# 2. 切换到旧版本
git checkout <previous-tag>
docker-compose build
docker-compose up -d
```

---

## 📞 支持

如有问题，请联系：
- 技术支持：support@example.com
- 文档：https://docs.example.com

---

**文档版本：** v1.0
**最后更新：** 2026-02-07
