import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isLoading: boolean
  fetchCart: () => Promise<void>
  setCart: (items: CartItem[], totalItems: number, totalAmount: number) => void
  addToCart: (productId: string | number, quantity?: number) => Promise<void>
  updateCartItem: (itemId: string | number, quantity: number) => Promise<void>
  removeFromCart: (itemId: string | number) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await api.get('/cart/')
          const { items, total_items, total_amount } = response.data
          set({
            items,
            totalItems: total_items,
            totalAmount: total_amount,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      setCart: (items: CartItem[], totalItems: number, totalAmount: number) => {
        set({ items, totalItems, totalAmount })
      },

      addToCart: async (productId: string | number, quantity = 1) => {
        await api.post('/cart/items/', {
          product_id: productId,
          quantity,
        })
        // Refresh cart after adding
        get().fetchCart()
      },

      updateCartItem: async (itemId: string | number, quantity: number) => {
        await api.patch(`/cart/items/${itemId}/`, { quantity })
        // Refresh cart after updating
        get().fetchCart()
      },

      removeFromCart: async (itemId: string | number) => {
        await api.delete(`/cart/items/${itemId}/`)
        // Refresh cart after removing
        get().fetchCart()
      },

      clearCart: async () => {
        await api.delete('/cart/clear/')
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
