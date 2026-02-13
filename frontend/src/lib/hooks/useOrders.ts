import { useRequest, useMutation } from './useRequest'

export interface OrderItem {
  id: number
  product: number
  product_name: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  status: string
  status_display: string
  total_amount: number
  created_at: string
  items: OrderItem[]
  shipping_address: string
}

export interface CreateOrderData {
  items: Array<{ product_id: number; quantity: number }>
  shipping_address: string
}

/**
 * 获取订单列表
 */
export function useOrders() {
  return useRequest<Order[]>('/orders/')
}

/**
 * 获取订单详情
 */
export function useOrder(id: number | string) {
  return useRequest<Order>(`/orders/${id}/`)
}

/**
 * 创建订单
 */
export function useCreateOrder() {
  const { mutate: createOrder, loading, error, data } = useMutation<Order, CreateOrderData>(
    'post',
    '/orders/create/'
  )

  return { createOrder, loading, error, order: data }
}

/**
 * 取消订单
 */
export function useCancelOrder() {
  const { mutate: cancelOrder, loading, error } = useMutation<any, { id: number }>(
    'post',
    '/orders/{id}/cancel/'
  )

  const cancel = async (id: number) => {
    const url = `/orders/${id}/cancel/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })

    return response
  }

  return { cancelOrder: cancel, loading, error }
}
