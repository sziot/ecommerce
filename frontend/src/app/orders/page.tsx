'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { LoadingPage } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty'
import { useAuthStore } from '@/store/authStore'
import { useRequest } from '@/lib/hooks'
import { toast } from '@/lib/utils/toast'
import api from '@/lib/api'

const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
  pending: { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-4 h-4" />, text: '待支付' },
  paid: { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-4 h-4" />, text: '已支付' },
  shipped: { color: 'bg-cyan-100 text-cyan-700', icon: <Truck className="w-4 h-4" />, text: '已发货' },
  completed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" />, text: '已完成' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" />, text: '已取消' },
}

interface OrderItem {
  id: number
  product_name: string
  product_image: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: number
  order_no: string
  status: string
  created_at: string
  actual_amount: number
  total_amount: number
  discount_amount: number
  shipping_fee: number
  items: OrderItem
  address?: {
    receiver_name: string
    receiver_phone: string
    province: string
    city: string
    district: string
    detail: string
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const { data: orders, loading } = useRequest<Order[]>('/orders/', {
    immediate: isAuthenticated,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/cancel/`)
      toast.success('订单已取消')
      window.location.reload()
    } catch (error) {
      toast.error('取消失败')
    }
  }

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setDetailModalOpen(true)
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      {orders?.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState title="暂无订单" description="您还没有订单" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders?.map((order: Order) => {
            const status = statusConfig[order.status]
            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">订单号：{order.order_no}</p>
                      <p className="text-sm text-gray-500">
                        下单时间：{new Date(order.created_at).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <img
                          src={item.product_image || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">¥{item.price} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t pt-4 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        共 {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} 件商品
                      </span>
                      <span className="text-sm">
                        实付：<span className="text-red-500 font-semibold text-lg">¥{order.actual_amount}</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" onClick={() => showOrderDetail(order)}>
                        <Eye className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          取消订单
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="订单详情"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">订单号：</span>
                <span>{selectedOrder.order_no}</span>
              </div>
              <div>
                <span className="text-gray-500">订单状态：</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].text}
                </span>
              </div>
              <div>
                <span className="text-gray-500">下单时间：</span>
                <span>{new Date(selectedOrder.created_at).toLocaleString('zh-CN')}</span>
              </div>
              {selectedOrder.address && (
                <>
                  <div className="col-span-2">
                    <span className="text-gray-500">收货人：</span>
                    <span>{selectedOrder.address.receiver_name} {selectedOrder.address.receiver_phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">收货地址：</span>
                    <span>{selectedOrder.address.province} {selectedOrder.address.city} {selectedOrder.address.district} {selectedOrder.address.detail}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">费用明细</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">商品总额：</span>
                  <span>¥{selectedOrder.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">优惠：</span>
                  <span className="text-red-500">-¥{selectedOrder.discount_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">运费：</span>
                  <span>¥{selectedOrder.shipping_fee}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>实付金额：</span>
                  <span className="text-red-500">¥{selectedOrder.actual_amount}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">商品清单</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.product_image || '/placeholder-product.jpg'}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">¥{item.price} x {item.quantity}</p>
                    </div>
                    <span className="font-semibold">¥{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
