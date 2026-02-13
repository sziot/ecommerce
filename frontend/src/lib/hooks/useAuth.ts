import { useMutation, useRequest } from './useRequest'
import { useAuthStore } from '@/store/authStore'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  nickname?: string
  phone?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: {
    id: number
    username: string
    email: string
    nickname?: string
    phone?: string
  }
}

/**
 * 登录 hook
 */
export function useLogin() {
  const { login: setAuth } = useAuthStore()

  const { mutate: login, loading, error } = useMutation<AuthResponse, LoginData>(
    'post',
    '/auth/login/',
    {
      onSuccess: (data) => {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        setAuth(data.user.username, 'DUMMY_PASSWORD') // 这里需要调整
        // 实际上 login 方法需要能接收完整响应，需要更新 authStore
      },
    }
  )

  return { login, loading, error }
}

/**
 * 注册 hook
 */
export function useRegister() {
  const { mutate: register, loading, error } = useMutation<any, RegisterData>(
    'post',
    '/auth/register/'
  )

  return { register, loading, error }
}

/**
 * 获取当前用户信息
 */
export function useMe() {
  const { updateUser } = useAuthStore()

  const { data, loading, error } = useRequest<any>('/auth/me/', {
    immediate: false, // 需要在认证后才请求
    onSuccess: (user) => {
      updateUser(user)
    },
  })

  return { user: data, loading, error }
}
