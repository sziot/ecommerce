'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Smartphone, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { toast } from '@/lib/utils/toast'

interface OrderDetail {
  id: string
  order_no: string
  status: string
  total_amount: number
  discount_amount: number
  shipping_fee: number
  actual_amount: number
  created_at: string
  items: Array<{
    id: string
    product_name: string
    product_image: string
    price: number
    quantity: number
    subtotal: number
  }>
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { isAuthenticated } = useAuthStore()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('alipay')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push('/orders')
        return
      }

      try {
        const response = await api.get(`/orders/${orderId}/`)
        setOrder(response.data)

        if (response.data.status !== 'pending') {
          toast.error('该订单不允许支付')
          router.push('/orders')
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
        toast.error('获取订单失败')
        router.push('/orders')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && orderId) {
      fetchOrder()
    }
  }, [isAuthenticated, orderId, router])

  const handlePayment = async () => {
    if (!order) return

    setPaying(true)
    try {
      const response = await api.post(`/orders/${order.id}/pay/`, {
        payment_method: paymentMethod,
      })

      if (response.data.success) {
        toast.success('支付成功')
        router.push('/orders')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || '支付失败')
    } finally {
      setPaying(false)
    }
  }

  if (!isAuthenticated || loading) {
    return <LoadingPage />
  }

  if (!order) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/orders')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回订单列表
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">确认支付</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">订单号</span>
                <span className="font-medium">{order.order_no}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">商品总额</span>
                <span>¥{order.total_amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">优惠</span>
                <span className="text-red-500">-¥{order.discount_amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">运费</span>
                <span>¥{order.shipping_fee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-lg font-semibold">
                <span>实付金额</span>
                <span className="text-red-500">¥{order.actual_amount}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">选择支付方式</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'alipay'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('alipay')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <p className="font-medium">支付宝</p>
                      <p className="text-xs text-gray-500">推荐使用</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'wechat'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('wechat')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">W</span>
                    </div>
                    <div>
                      <p className="font-medium">微信支付</p>
                      <p className="text-xs text-gray-500">便捷快速</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">
                <strong>测试提示：</strong>当前为模拟支付系统，点击"立即支付"按钮即可完成支付，无需真实付款。
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={paying}
            >
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  支付中...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  立即支付 ¥{order.actual_amount}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PaymentContent />
    </Suspense>
  )
}
