#!/bin/bash
# 配置Nginx反向代理脚本
# 用于服务器IP 106.75.44.210

echo "开始配置Nginx反向代理..."

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo "请以root权限运行此脚本（使用sudo）"
    exit 1
fi

# 检查Nginx是否已安装
if ! command -v nginx &> /dev/null; then
    echo "正在安装Nginx..."
    apt update
    apt install -y nginx
fi

# 创建Nginx配置文件
NGINX_CONFIG_PATH="/etc/nginx/sites-available/ecommerce"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/ecommerce"

echo "创建Nginx配置文件..."

# 复制配置到Nginx目录
cp /home/ubuntu/ecommerce/nginx_ecommerce.conf $NGINX_CONFIG_PATH

# 创建软链接启用站点
ln -sf $NGINX_CONFIG_PATH $NGINX_ENABLED_PATH

# 禁用默认站点（可选）
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    echo "已禁用默认Nginx站点"
fi

# 测试Nginx配置
echo "测试Nginx配置..."
nginx -t
if [ $? -ne 0 ]; then
    echo "Nginx配置测试失败，请检查配置文件"
    exit 1
fi

# 重新加载Nginx配置
echo "重新加载Nginx配置..."
systemctl reload nginx

# 确保Nginx服务已启动
systemctl enable nginx
systemctl start nginx

echo "Nginx反向代理配置完成！"
echo "您的电商网站现在可以通过以下地址访问："
echo "  http://106.75.44.210"
echo ""
echo "如果需要HTTPS访问，请运行以下命令安装SSL证书："
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d 106.75.44.210"
echo ""
echo "确保服务器防火墙允许HTTP(80)和HTTPS(443)端口访问"