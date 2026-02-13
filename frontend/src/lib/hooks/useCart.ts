import { useRequest, useMutation } from './useRequest'
import { useCartStore } from '@/store/cartStore'

export interface CartItem {
  id: number
  product: number
  product_name: string
  product_image: string | null
  price: number
  quantity: number
  subtotal: number
}

export interface CartResponse {
  items: CartItem[]
  total_items: number
  total_price: number
}

/**
 * 获取购物车
 */
export function useCart() {
  const { setCart } = useCartStore()

  const { data, loading, error, refetch } = useRequest<CartResponse>('/cart/', {
    onSuccess: (cart) => {
      setCart(cart.items, cart.total_items, cart.total_price)
    },
  })

  return { cart: data, loading, error, refetch }
}

/**
 * 添加商品到购物车
 */
export function useAddToCart() {
  const { refetch: refetchCart } = useCart()

  const { mutate: addToCart, loading, error } = useMutation<any, { product_id: number; quantity: number }>(
    'post',
    '/cart/items/',
    {
      onSuccess: () => {
        refetchCart()
      },
    }
  )

  return { addToCart, loading, error }
}

/**
 * 更新购物车商品数量
 */
export function useUpdateCartItem() {
  const { refetch: refetchCart } = useCart()

  const { mutate: updateItem, loading, error } = useMutation<any, { id: number; quantity: number }>(
    'patch',
    '/cart/items/{id}/', // 这个需要动态替换
    {
      onSuccess: () => {
        refetchCart()
      },
    }
  )

  const updateCartItem = async (id: number, quantity: number) => {
    // 动态构建 URL
    const url = `/cart/items/${id}/`
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ quantity }),
    })

    if (response.ok) {
      refetchCart()
    }

    return response
  }

  return { updateCartItem, loading, error }
}

/**
 * 删除购物车商品
 */
export function useRemoveCartItem() {
  const { refetch: refetchCart } = useCart()

  const removeCartItem = async (id: number) => {
    const url = `/cart/items/${id}/`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })

    if (response.ok) {
      refetchCart()
    }

    return response
  }

  return { removeCartItem }
}
