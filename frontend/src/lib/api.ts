import axios from 'axios'
import { toast } from './utils/toast'

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - 动态设置 baseURL 和添加 token
api.interceptors.request.use(
  (config) => {
    // 动态设置 baseURL
    let baseURL = process.env.NEXT_PUBLIC_API_URL

    // 如果环境变量未设置，使用默认值
    if (!baseURL) {
      // 检查是否为开发环境（localhost 或 IP 地址）
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname
        // 本地开发使用本地后端
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.') || hostname.includes('10.') || hostname.includes('172.')) {
          baseURL = 'http://localhost:8000/api/v1'
        } else {
          // 生产环境：优先使用环境变量，否则使用相对路径（假设通过反向代理）
          baseURL = process.env.NEXT_PUBLIC_PROD_API_URL || '/api/v1'
        }
      } else {
        // 服务端渲染时的默认值
        baseURL = 'http://localhost:8000/api/v1'
      }
    }

    config.baseURL = baseURL

    // 添加认证 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - 处理错误和 token 刷新
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 error - token expired
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(
            `${originalRequest.baseURL}/auth/refresh/`,
            { refresh: refreshToken }
          )

          const { access } = response.data
          localStorage.setItem('access_token', access)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.detail || error.message || '请求失败'
    if (typeof window !== 'undefined') {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default api
