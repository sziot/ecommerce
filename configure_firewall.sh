#!/bin/bash
# 防火墙配置脚本 - 为服务器IP 106.75.44.210配置访问规则

echo "配置防火墙规则..."

# 检查是否已安装ufw
if ! command -v ufw &> /dev/null; then
    echo "正在安装ufw防火墙..."
    apt update
    apt install -y ufw
fi

# 允许SSH连接（避免被锁定）
ufw allow ssh
echo "已允许SSH连接"

# 允许HTTP和HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
echo "已允许HTTP和HTTPS连接"

# 可选：如果您需要直接访问Docker容器端口
# ufw allow 3000/tcp  # 前端
# ufw allow 8000/tcp  # 后端

# 启用防火墙
ufw --force enable

echo "防火墙配置完成！"
echo ""
echo "当前防火墙状态："
ufw status verbose