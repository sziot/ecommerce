# 外网访问配置指南

## Nginx反向代理配置

将以下配置添加到您的Nginx服务器（通常在 `/etc/nginx/sites-available/` 目录下）：

```nginx
server {
    listen 80;
    # 替换为您的实际域名
    server_name your-domain.com www.your-domain.com;

    # 设置请求体大小限制
    client_max_body_size 100M;

    # 前端页面请求
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
        proxy_redirect off;
    }

    # API 请求代理到后端
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # 增加超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存优化
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## HTTPS配置（推荐）

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    client_max_body_size 100M;

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

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# HTTP到HTTPS重定向
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 防火墙配置

确保服务器防火墙允许以下端口：

```bash
# 对于使用ufw的Ubuntu系统
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH访问

# 启用防火墙
sudo ufw enable
```

## 启动服务

```bash
cd /home/ubuntu/ecommerce
./start.sh
```

## 验证配置

启动服务后，验证配置是否正确：

1. 检查Docker容器状态：
   ```bash
   docker-compose ps
   ```

2. 验证API可访问：
   ```bash
   curl http://localhost:8000/api/v1/products/featured/
   ```

3. 检查前端可访问：
   ```bash
   curl http://localhost:3000
   ```

## 故障排除

如果外网仍然无法访问热点推荐数据：

1. 检查后端服务是否正常运行
2. 验证Nginx反向代理配置是否正确加载
3. 确认防火墙设置允许相应端口
4. 检查域名DNS解析是否正确

## 生产环境优化建议

1. 使用专用的生产数据库
2. 启用Redis缓存优化性能
3. 配置SSL证书提供HTTPS访问
4. 设置适当的日志记录和监控
5. 定期备份数据