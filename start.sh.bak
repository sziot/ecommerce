#!/bin/bash
# 外网访问电商平台的启动脚本

echo "正在配置电商平台以支持外网访问..."

# 确保在项目根目录
cd /home/ubuntu/ecommerce

# 构建并启动Docker服务
echo "启动Docker服务..."
docker-compose up -d --build

echo "服务启动中..."

# 等待服务启动
sleep 10

echo "========================================="
echo "电商平台已启动！"
echo "========================================="
echo "内网访问地址: http://localhost:3000"
echo "外网访问地址: http://[您的服务器IP]:3000"
echo "后端API地址: http://[您的服务器IP]:8000/api/v1"
echo ""
echo "为获得最佳外网访问体验，请配置Nginx反向代理："
echo "1. 将以下配置添加到您的Nginx服务器:"
echo "   include /home/ubuntu/ecommerce/nginx.conf;"
echo "2. 或者直接使用此配置文件设置反向代理"
echo "3. 确保服务器防火墙开放80和443端口"
echo ""
echo "生产环境部署建议:"
echo "- 在生产环境使用域名而非IP地址"
echo "- 配置SSL证书启用HTTPS"
echo "- 使用Nginx作为反向代理处理静态资源"
echo "- 考虑使用CDN加速静态资源访问"
echo "========================================="