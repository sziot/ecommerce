'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { useProduct } from '@/lib/hooks'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/lib/utils/toast'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: product, loading } = useProduct(productId)

  if (loading) {
    return <LoadingPage />
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">商品不存在</p>
      </div>
    )
  }

  const images = product.main_image ? [{ image: product.main_image }] : []

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      toast.success('已加入购物车')
    } catch (error) {
      toast.error('加入购物车失败')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <Card>
            <img
              src={images[currentImageIndex]?.image || product.main_image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full rounded-t-lg"
            />
            {images.length > 1 && (
              <div className="p-4 grid grid-cols-5 gap-2">
                {images.map((img: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={img.image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category_name || ''}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl text-red-500 font-semibold">
                ¥{product.price}
              </span>
              {product.original_price && (
                <>
                  <span className="text-gray-400 line-through text-xl">
                    ¥{product.original_price}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    {product.discount_percent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p>
              <span className="font-semibold">库存：</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} 件` : '缺货'}
              </span>
            </p>
            <p>
              <span className="font-semibold">销量：</span>
              <span>{product.sales} 件</span>
            </p>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2">数量：</p>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-16 text-center border rounded py-1"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="mb-6"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock > 0 ? '加入购物车' : '缺货'}
          </Button>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">商品描述</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
