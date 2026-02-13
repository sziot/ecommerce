import { useRequest, useLazyRequest } from './useRequest'
import { useMutation } from './useRequest'
import api from '../api'

export interface Product {
  id: string
  name: string
  description: string
  price: string | number
  original_price?: string | number | null
  discount_percent: number
  sales: number
  stock: number
  category: string | number
  category_name: string
  main_image: string
  is_featured: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

/**
 * 获取商品列表
 */
export function useProducts(params?: Record<string, any>) {
  const queryString = params ? new URLSearchParams(params as any).toString() : ''
  const url = `/products/${queryString ? `?${queryString}` : ''}`

  return useRequest<ProductsResponse>(url)
}

/**
 * 获取热门商品
 */
export function useFeaturedProducts() {
  return useRequest<Product[]>('/products/featured/')
}

/**
 * 获取商品详情
 */
export function useProduct(id: number | string) {
  return useRequest<Product>(`/products/${id}/`)
}

/**
 * 搜索商品（延迟请求）
 */
export function useProductSearch() {
  const { execute, loading, data, error } = useLazyRequest<ProductsResponse>()

  const search = async (query: string, category?: string) => {
    const params: Record<string, any> = {}
    if (query) params.search = query
    if (category) params.category = category

    await execute({
      url: '/products/',
      method: 'get',
      data: params,
    })
  }

  return { search, loading, data, error }
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useRequest<any[]>('/categories/')
}
