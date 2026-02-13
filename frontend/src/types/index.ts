export interface User {
  id: string
  username: string
  email: string
  nickname?: string
  phone?: string
  avatar?: string
}

export interface Address {
  id: string
  receiver_name: string
  receiver_phone: string
  province: string
  city: string
  district: string
  detail: string
  postal_code?: string
  is_default: boolean
}

export interface Category {
  id: string
  name: string
  parent?: string
  image?: string
  icon?: string
  children?: Category[]
  product_count?: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  discount_percent: number
  stock: number
  sales: number
  category: string
  category_name?: string
  main_image: string
  images?: ProductImage[]
  is_featured: boolean
  in_stock?: boolean
  specifications?: Record<string, any>
}

export interface ProductImage {
  id: string
  image: string
  order: number
  alt_text?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  subtotal: number
}

export interface OrderItem {
  id: string
  product: Product
  product_name: string
  product_image: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_no: string
  address: Address
  total_amount: number
  discount_amount: number
  shipping_fee: number
  actual_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  status_display: string
  remarks?: string
  items: OrderItem[]
  paid_at?: string
  shipped_at?: string
  completed_at?: string
  cancelled_at?: string
  created_at: string
}

export interface ApiResponse<T> {
  count?: number
  next?: string
  previous?: string
  results?: T[]
}
