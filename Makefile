# Makefile for Ecommerce Project

.PHONY: help install dev test build deploy clean

help:  ## 显示帮助信息
	@echo "可用命令："
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:  ## 安装依赖
	@echo "安装后端依赖..."
	cd backend && pip install -r requirements/base.txt
	@echo "安装前端依赖..."
	cd frontend && npm install

dev:  ## 启动开发服务器
	@echo "启动开发服务器..."
	docker-compose up

dev-backend:  ## 仅启动后端
	cd backend && python manage.py runserver

dev-frontend:  ## 仅启动前端
	cd frontend && npm run dev

test:  ## 运行测试
	@echo "运行后端测试..."
	cd backend && source venv/bin/activate && pytest
	@echo "运行前端测试..."
	cd frontend && npm run test

test-backend:  ## 仅运行后端测试
	cd backend && pytest

test-frontend:  ## 仅运行前端测试
	cd frontend && npm run test

init-dev:  ## 初始化开发环境
	@echo "启动 Docker 容器..."
	docker-compose up -d db redis
	@echo "等待数据库启动..."
	sleep 5
	@echo "运行数据库迁移..."
	docker-compose exec backend python manage.py migrate
	@echo "生成测试数据..."
	docker-compose exec backend python manage.py generate_fake_data
	@echo "初始化完成！访问 http://localhost:3000"

build:  ## 构建生产版本
	@echo "构建前端..."
	cd frontend && npm run build
	@echo "收集静态文件..."
	cd backend && python manage.py collectstatic --noinput

migrate:  ## 运行数据库迁移
	cd backend && python manage.py migrate

createsuperuser:  ## 创建超级用户
	cd backend && python manage.py createsuperuser

generate-data:  ## 生成测试数据
	cd backend && python manage.py generate_fake_data

init-db:  ## 初始化数据库（迁移 + 生成数据）
	@echo "运行数据库迁移..."
	$(MAKE) migrate
	@echo "生成测试数据..."
	$(MAKE) generate-data

deploy:  ## 部署到生产环境
	docker-compose -f docker-compose.prod.yml up -d --build

clean:  ## 清理临时文件
	@echo "清理 Python 缓存..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	@echo "清理前端构建..."
	rm -rf frontend/dist
	@echo "清理 Docker..."
	docker-compose down -v

logs:  ## 查看日志
	docker-compose logs -f

backup:  ## 备份数据库
	docker-compose exec db pg_dump -U postgres ecommerce_prod > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore:  ## 恢复数据库（用法：make restore FILE=backup.sql）
	docker-compose exec -T db psql -U postgres ecommerce_prod < $(FILE)
