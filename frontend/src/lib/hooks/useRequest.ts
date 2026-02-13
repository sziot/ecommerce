import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../api'
import { toast } from '../utils/toast'

interface UseRequestOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseRequestResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: () => Promise<void>
  refetch: () => Promise<void>
}

/**
 * 通用的数据请求 hook（替代 TanStack Query 的 useQuery）
 *
 * @param url - API 端点
 * @param options - 配置选项
 * @returns { data, loading, error, execute, refetch }
 *
 * @example
 * const { data, loading, error, refetch } = useRequest('/products')
 */
export function useRequest<T = any>(
  url: string,
  options: UseRequestOptions = {}
): UseRequestResult<T> {
  const { immediate = true, onSuccess, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 使用 ref 存储回调，避免依赖变化
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  })

  const execute = useCallback(async () => {
    console.log('[useRequest] execute called for URL:', url)
    setLoading(true)
    setError(null)

    try {
      const response = await api.get(url)
      console.log('[useRequest] Got response:', response.data)
      setData(response.data)
      console.log('[useRequest] Data set successfully')
      onSuccessRef.current?.(response.data)
    } catch (err) {
      console.error('[useRequest] Error:', err)
      const error = err as Error
      setError(error)
      onErrorRef.current?.(error)
    } finally {
      console.log('[useRequest] Setting loading to false')
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute, refetch: execute }
}

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  onSettled?: () => void
}

interface UseMutationResult<TData, TVariables> {
  data: TData | null
  loading: boolean
  error: Error | null
  mutate: (variables: TVariables) => Promise<TData>
  reset: () => void
}

/**
 * 通用的变更操作 hook（替代 TanStack Query 的 useMutation）
 *
 * @param method - HTTP 方法
 * @param url - API 端点
 * @param options - 配置选项
 * @returns { data, loading, error, mutate, reset }
 *
 * @example
 * const { mutate, loading } = useMutation('post', '/auth/login')
 * await mutate({ username, password })
 */
export function useMutation<TData = any, TVariables = any>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setLoading(true)
      setError(null)

      try {
        let response
        switch (method) {
          case 'post':
            response = await api.post(url, variables)
            break
          case 'put':
            response = await api.put(url, variables)
            break
          case 'patch':
            response = await api.patch(url, variables)
            break
          case 'delete':
            response = await api.delete(url, { data: variables })
            break
        }

        setData(response.data)
        onSuccess?.(response.data)
        return response.data
      } catch (err) {
        const error = err as Error
        setError(error)
        onError?.(error)
        throw error
      } finally {
        setLoading(false)
        onSettled?.()
      }
    },
    [method, url, onSuccess, onError, onSettled]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, mutate, reset }
}

interface UseLazyRequestOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseLazyRequestResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (params: { url: string; method?: string; data?: any }) => Promise<void>
}

/**
 * 延迟请求 hook（只在手动调用时执行）
 *
 * @param options - 配置选项
 * @returns { data, loading, error, execute }
 *
 * @example
 * const { execute, loading } = useLazyRequest()
 * await execute({ url: '/products', method: 'get' })
 */
export function useLazyRequest<T = any>(
  options: UseLazyRequestOptions = {}
): UseLazyRequestResult<T> {
  const { onSuccess, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async ({ url, method = 'get', data: requestData }: { url: string; method?: string; data?: any }) => {
      setLoading(true)
      setError(null)

      try {
        let response
        switch (method) {
          case 'get':
            response = await api.get(url, { params: requestData })
            break
          case 'post':
            response = await api.post(url, requestData)
            break
          case 'put':
            response = await api.put(url, requestData)
            break
          case 'patch':
            response = await api.patch(url, requestData)
            break
          case 'delete':
            response = await api.delete(url, { data: requestData })
            break
          default:
            throw new Error(`Unsupported method: ${method}`)
        }

        setData(response.data)
        onSuccess?.(response.data)
      } catch (err) {
        const error = err as Error
        setError(error)
        onError?.(error)
      } finally {
        setLoading(false)
      }
    },
    [onSuccess, onError]
  )

  return { data, loading, error, execute }
}
