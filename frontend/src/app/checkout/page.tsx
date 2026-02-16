'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Package, CreditCard, CheckCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { LoadingPage } from '@/components/ui/loading'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/api'
import { toast } from '@/lib/utils/toast'

interface Address {
  id: string
  receiver_name: string
  receiver_phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default: boolean
}

interface AddressFormData {
  receiver_name: string
  receiver_phone: string
  province: string
  city: string
  district: string
  detail: string
  postal_code: string
  is_default: boolean
}

const initialFormData: AddressFormData = {
  receiver_name: '',
  receiver_phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  postal_code: '',
  is_default: false,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { items, totalAmount, fetchCart, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressFormData, setAddressFormData] = useState<AddressFormData>(initialFormData)
  const [savingAddress, setSavingAddress] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCart().then(() => setLoading(false))
  }, [isAuthenticated, router, fetchCart])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/auth/addresses/')
      const addressList = response.data.results || response.data
      setAddresses(addressList)
      if (addressList.length > 0) {
        const defaultAddress = addressList.find((a: Address) => a.is_default)
        setSelectedAddressId(defaultAddress?.id || addressList[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses()
    }
  }, [isAuthenticated])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddAddress = async () => {
    if (!addressFormData.receiver_name || !addressFormData.receiver_phone || 
        !addressFormData.province || !addressFormData.city || 
        !addressFormData.district || !addressFormData.detail) {
      toast.error('请填写完整的收货信息')
      return
    }

    setSavingAddress(true)
    try {
      await api.post('/auth/addresses/', addressFormData)
      toast.success('地址添加成功')
      setShowAddressModal(false)
      setAddressFormData(initialFormData)
      await fetchAddresses()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '添加地址失败')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      toast.error('请选择收货地址')
      return
    }
    if (items.length === 0) {
      toast.error('购物车是空的')
      return
    }

    setSubmitting(true)
    try {
      const cartItemIds = items.map((item) => item.id)
      await api.post('/orders/create/', {
        address_id: selectedAddressId,
        cart_item_ids: cartItemIds,
      })
      await clearCart()
      toast.success('订单创建成功')
      router.push('/orders')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || '创建订单失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated || loading) {
    return <LoadingPage />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">购物车是空的</h2>
            <p className="text-gray-500 mb-4">请先添加商品到购物车</p>
            <Button variant="primary" onClick={() => router.push('/products')}>
              去购物
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">确认订单</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                收货地址
              </CardTitle>
              <Button variant="default" size="sm" onClick={() => setShowAddressModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                添加地址
              </Button>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">暂无收货地址</p>
                  <Button variant="primary" onClick={() => setShowAddressModal(true)}>
                    添加收货地址
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {selectedAddressId === address.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{address.receiver_name}</span>
                            <span className="text-gray-600">{address.receiver_phone}</span>
                            {address.is_default && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                默认
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {address.province} {address.city} {address.district} {address.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                商品清单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.main_image || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        ¥{item.product.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-500 font-semibold">¥{item.subtotal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                订单 summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品件数</span>
                  <span>{items.length} 件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总额</span>
                  <span>¥{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费</span>
                  <span>¥{totalAmount >= 199 ? 0 : 10}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>实付金额</span>
                  <span className="text-red-500">
                    ¥{totalAmount + (totalAmount >= 199 ? 0 : 10)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mt-6"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={!selectedAddressId || addresses.length === 0 || submitting}
              >
                {submitting ? '提交中...' : '提交订单'}
              </Button>

              {totalAmount < 199 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  再购 ¥{199 - totalAmount} 即可享受免费配送
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="添加收货地址"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">收货人姓名</label>
              <input
                type="text"
                name="receiver_name"
                value={addressFormData.receiver_name}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入收货人姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系电话</label>
              <input
                type="tel"
                name="receiver_phone"
                value={addressFormData.receiver_phone}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入联系电话"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">省份</label>
              <input
                type="text"
                name="province"
                value={addressFormData.province}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：广东省"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">城市</label>
              <input
                type="text"
                name="city"
                value={addressFormData.city}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：深圳市"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">区/县</label>
              <input
                type="text"
                name="district"
                value={addressFormData.district}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：南山区"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">详细地址</label>
            <input
              type="text"
              name="detail"
              value={addressFormData.detail}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2"
              placeholder="请输入详细地址"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">邮政编码（可选）</label>
              <input
                type="text"
                name="postal_code"
                value={addressFormData.postal_code}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入邮政编码"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer mt-6">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={addressFormData.is_default}
                  onChange={handleAddressChange}
                  className="w-4 h-4"
                />
                <span className="text-sm">设为默认地址</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="default" onClick={() => setShowAddressModal(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleAddAddress} disabled={savingAddress}>
              {savingAddress ? '保存中...' : '保存地址'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
