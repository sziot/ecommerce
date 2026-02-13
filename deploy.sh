#!/bin/bash
# 完整部署脚本 - 为服务器IP 106.75.44.210部署电商网站
# 包含启动服务和配置Nginx反向代理

echo "========================================="
echo "开始部署电商网站到服务器 106.75.44.210"
echo "========================================="

# 确保在项目根目录
cd /home/ubuntu/ecommerce

# 启动Docker服务
echo "启动Docker服务..."
docker-compose up -d --build

# 等待服务启动
echo "等待服务启动..."
sleep 20

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

echo ""
echo "配置Nginx反向代理..."

# 运行Nginx配置脚本（需要sudo权限）
echo "请运行以下命令以root权限配置Nginx："
echo "  sudo /home/ubuntu/ecommerce/configure_nginx.sh"
echo ""
echo "或者如果您希望现在就配置（如果以root身份运行）："
echo "  /home/ubuntu/ecommerce/configure_nginx.sh"
echo ""

echo "========================================="
echo "部署说明："
echo "1. 启动服务：docker-compose up -d"
echo "2. 配置Nginx：sudo /home/ubuntu/ecommerce/configure_nginx.sh"
echo "3. 访问网站：http://106.75.44.210"
echo "4. 停止服务：docker-compose down"
echo "========================================="

echo "如果需要防火墙配置，请运行以下命令："
echo "  sudo ufw allow 80/tcp"
echo "  sudo ufw allow 443/tcp"
echo "  sudo ufw allow 3000/tcp  # 如果直接访问前端"
echo "  sudo ufw allow 8000/tcp  # 如果直接访问后端"