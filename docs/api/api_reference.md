# API 接口文档

## 📋 API 概述

### 基础信息

- **Base URL:** `https://api.example.com/api/v1`
- **认证方式:** JWT Bearer Token
- **数据格式:** JSON
- **字符编码:** UTF-8

### 通用响应格式

**成功响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**错误响应：**
```json
{
  "code": 400,
  "message": "error message",
  "errors": {}
}
```

---

## 🔐 认证接口

### 1. 用户注册

**接口：** `POST /auth/register`

**请求参数：**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**响应示例：**
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "test",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. 用户登录

**接口：** `POST /auth/login`

**请求参数：**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "test",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. 刷新 Token

**接口：** `POST /auth/refresh`

**请求参数：**
```json
{
  "refresh_token": "string"
}
```

### 4. 获取当前用户信息

**接口：** `GET /auth/me`

**请求头：**
```
Authorization: Bearer {token}
```

---

## 🛍️ 商品接口

### 1. 商品列表

**接口：** `GET /products`

**查询参数：**
- `page`: 页码（默认 1）
- `page_size`: 每页数量（默认 20）
- `category`: 分类 ID
- `keyword`: 搜索关键词
- `sort`: 排序方式（default, price_asc, price_desc, sales, newest）
- `price_min`: 最低价格
- `price_max`: 最高价格

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": 1,
        "name": "商品名称",
        "description": "商品描述",
        "price": "99.99",
        "original_price": "199.99",
        "stock": 100,
        "sales": 50,
        "images": ["https://example.com/image.jpg"],
        "category": {
          "id": 1,
          "name": "分类名称"
        }
      }
    ]
  }
}
```

### 2. 商品详情

**接口：** `GET /products/{id}`

**路径参数：**
- `id`: 商品 ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "商品名称",
    "description": "详细描述",
    "price": "99.99",
    "original_price": "199.99",
    "stock": 100,
    "sales": 50,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "category": {
      "id": 1,
      "name": "分类名称"
    },
    "specs": [
      {
        "id": 1,
        "name": "颜色",
        "values": ["红色", "蓝色", "黑色"]
      }
    ],
    "reviews": {
      "total": 100,
      "average_rating": 4.5
    }
  }
}
```

### 3. 商品搜索

**接口：** `GET /products/search`

**查询参数：**
- `keyword`: 搜索关键词
- `page`: 页码
- `page_size`: 每页数量

---

## 🛒 购物车接口

### 1. 获取购物车

**接口：** `GET /cart`

**请求头：**
```
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "商品名称",
          "price": "99.99",
          "image": "https://example.com/image.jpg"
        },
        "spec": null,
        "quantity": 2,
        "total_price": "199.98"
      }
    ],
    "total_quantity": 2,
    "total_price": "199.98"
  }
}
```

### 2. 添加商品到购物车

**接口：** `POST /cart/items`

**请求参数：**
```json
{
  "product_id": 1,
  "spec_id": null,
  "quantity": 1
}
```

### 3. 修改购物车商品数量

**接口：** `PUT /cart/items/{id}`

**路径参数：**
- `id`: 购物车项 ID

**请求参数：**
```json
{
  "quantity": 2
}
```

### 4. 删除购物车商品

**接口：** `DELETE /cart/items/{id}`

**路径参数：**
- `id`: 购物车项 ID

### 5. 清空购物车

**接口：** `DELETE /cart`

---

## 📦 订单接口

### 1. 创建订单

**接口：** `POST /orders`

**请求参数：**
```json
{
  "address_id": 1,
  "items": [
    {
      "cart_item_id": 1
    }
  ],
  "coupon_id": null,
  "remark": ""
}
```

**响应示例：**
```json
{
  "code": 201,
  "message": "订单创建成功",
  "data": {
    "id": 1,
    "order_no": "20260207123456",
    "total_amount": "199.98",
    "discount_amount": "0.00",
    "pay_amount": "199.98",
    "status": "pending"
  }
}
```

### 2. 订单列表

**接口：** `GET /orders`

**查询参数：**
- `page`: 页码
- `page_size`: 每页数量
- `status`: 订单状态

### 3. 订单详情

**接口：** `GET /orders/{id}`

**路径参数：**
- `id`: 订单 ID

### 4. 取消订单

**接口：** `POST /orders/{id}/cancel`

### 5. 确认收货

**接口：** `POST /orders/{id}/confirm`

---

## 💳 支付接口

### 1. 创建支付

**接口：** `POST /payment/create`

**请求参数：**
```json
{
  "order_id": 1,
  "method": "alipay"
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "payment_url": "https://openapi.alipay.com/gateway.do?..."
  }
}
```

### 2. 支付回调

**接口：** `POST /payment/callback`

### 3. 查询支付状态

**接口：** `GET /payment/status/{order_id}`

---

## 👤 用户接口

### 1. 获取个人信息

**接口：** `GET /users/profile`

### 2. 更新个人信息

**接口：** `PUT /users/profile`

**请求参数：**
```json
{
  "nickname": "昵称",
  "avatar": "头像 URL",
  "phone": "手机号"
}
```

### 3. 收货地址列表

**接口：** `GET /users/addresses`

### 4. 添加收货地址

**接口：** `POST /users/addresses`

**请求参数：**
```json
{
  "receiver_name": "收货人",
  "receiver_phone": "手机号",
  "province": "省份",
  "city": "城市",
  "detail": "详细地址",
  "is_default": false
}
```

### 5. 更新收货地址

**接口：** `PUT /users/addresses/{id}`

### 6. 删除收货地址

**接口：** `DELETE /users/addresses/{id}`

---

## 🎫 优惠券接口

### 1. 可用优惠券列表

**接口：** `GET /coupons/available`

### 2. 领取优惠券

**接口：** `POST /coupons/{id}/claim`

### 3. 我的优惠券

**接口：** `GET /coupons/my`

---

## ⚠️ 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 📊 限流规则

- 未认证用户：60 次/分钟
- 已认证用户：120 次/分钟
- 支付接口：10 次/分钟

---

**文档版本：** v1.0
**最后更新：** 2026-02-07
