'use client'

import { ShoppingBag, Truck, Shield, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty'
import { useFeaturedProducts } from '@/lib/hooks'
import { useEffect } from 'react'
import { Product } from '@/types'

export default function Home() {
  const { data: featuredProducts, loading, error } = useFeaturedProducts()

  // Debug: 打印数据到控制台
  useEffect(() => {
    console.log('Featured Products Data:', featuredProducts)
    console.log('Loading:', loading)
    console.log('Error:', error)
  }, [featuredProducts, loading, error])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-12 text-white">
        <h1 className="text-4xl font-bold mb-4">欢迎来到我们的电商平台</h1>
        <p className="text-lg mb-6 opacity-90">发现优质商品，享受便捷购物体验</p>
        <Link href="/products">
          <Button variant="default" className="bg-white text-blue-600 hover:bg-gray-100">
            立即购物
          </Button>
        </Link>
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">热门推荐</h2>

        {loading ? (
          <LoadingPage />
        ) : error ? (
          <Card>
            <CardContent className="p-12">
              <p className="text-red-500 text-center">加载失败，请稍后重试</p>
            </CardContent>
          </Card>
        ) : !featuredProducts || featuredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <EmptyState
                title="暂无推荐商品"
                description="敬请期待更多精彩商品"
                icon={<Package className="w-12 h-12" />}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative">
                    <img
                      alt={product.name}
                      src={product.main_image || '/placeholder-product.jpg'}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.discount_percent > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        {product.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-red-500 font-semibold text-lg">
                        ¥{product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-gray-400 line-through text-sm">
                          ¥{product.original_price}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      已售 {product.sales} 件
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h4 className="font-semibold mb-2">品质保证</h4>
          <p className="text-gray-600 text-sm">精选优质商品，严格品控</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <Truck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h4 className="font-semibold mb-2">快速配送</h4>
          <p className="text-gray-600 text-sm">全国包邮，快速送达</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <ShoppingBag className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h4 className="font-semibold mb-2">售后无忧</h4>
          <p className="text-gray-600 text-sm">7天无理由退换货</p>
        </div>
      </div>
    </div>
  )
}
