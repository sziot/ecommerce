'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/lib/utils/toast'

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { items, totalItems, totalAmount, fetchCart, updateCartItem, removeFromCart } = useCartStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCart().finally(() => setLoading(false))
  }, [isAuthenticated, router, fetchCart])

  const handleQuantityChange = async (itemId: string | number, value: number) => {
    try {
      await updateCartItem(itemId, value)
    } catch (error) {
      toast.error('更新失败')
    }
  }

  const handleRemove = async (itemId: string | number) => {
    try {
      await removeFromCart(itemId)
      toast.success('已删除')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  if (!isAuthenticated || loading) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6" />
        <h1 className="text-2xl font-bold">购物车</h1>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              title="购物车是空的"
              description="快去选购心仪的商品吧"
              action={
                <Button variant="primary" onClick={() => router.push('/products')}>
                  去购物
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-semibold text-sm">
                <div className="col-span-6">商品</div>
                <div className="col-span-2">单价</div>
                <div className="col-span-2">数量</div>
                <div className="col-span-1">小计</div>
                <div className="col-span-1">操作</div>
              </div>

              {/* Items */}
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b items-center"
                >
                  {/* Product */}
                  <div className="col-span-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.main_image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <span className="text-red-500 font-semibold">¥{item.product.price}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <input
                        type="number"
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(item.product.stock, parseInt(e.target.value) || 1))
                          handleQuantityChange(item.id, value)
                        }}
                        className="w-16 text-center border rounded py-1"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-1">
                    <span className="text-red-500 font-semibold text-lg">¥{item.subtotal}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="text-gray-600">
                    已选择 <span className="text-blue-600 font-semibold">{totalItems}</span> 件商品
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-600">
                      合计：<span className="text-red-500 font-semibold text-2xl">¥{totalAmount}</span>
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => router.push('/checkout')}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    去结算
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                  满 ¥199 包邮
                </span>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  7天无理由退换
                </span>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                  正品保障
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
