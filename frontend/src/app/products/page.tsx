'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { SearchInput } from '@/components/ui/search-input'
import { Select } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { LoadingPage } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty'
import { Package } from 'lucide-react'
import { useRequest } from '@/lib/hooks'
import api from '@/lib/api'

interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  main_image: string
  discount_percent: number
  sales: number
  stock: number
}

interface Category {
  id: number
  name: string
  parent?: Category
  children?: Category[]
}

interface ProductsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState('')
  const [ordering, setOrdering] = useState('-created_at')

  // 获取分类列表
  const { data: categories } = useRequest<Category[]>('/categories/', { immediate: true })

  // 获取商品列表
  const buildQueryString = () => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (ordering) params.append('ordering', ordering)
    params.append('page', page.toString())
    return params.toString()
  }

  const { data: productsData, loading } = useRequest<ProductsResponse>(
    `/products/?${buildQueryString()}`,
    { immediate: true }
  )

  const products = productsData?.results || []
  const count = productsData?.count || 0

  // Flatten categories for Select
  const flattenCategories = (cats: Category[] | null | undefined): Category[] => {
    if (!cats || !Array.isArray(cats)) return []
    let result: Category[] = []
    ;(cats as Category[]).forEach((cat) => {
      result.push(cat)
      if (cat.children) {
        result = result.concat(flattenCategories(cat.children))
      }
    })
    return result
  }

  const flatCategories = categories ? flattenCategories(categories) : []

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  const handleOrderingChange = (value: string) => {
    setOrdering(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">商品列表</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] max-w-md">
            <SearchInput
              placeholder="搜索商品"
              onSearch={handleSearch}
            />
          </div>

          <Select
            placeholder="选择分类"
            value={category}
            onChange={handleCategoryChange}
            allowClear
            options={flatCategories.map((cat) => ({
              label: `${cat.parent ? '└ ' : ''}${cat.name}`,
              value: cat.id.toString(),
            }))}
          />

          <Select
            placeholder="排序方式"
            value={ordering}
            onChange={handleOrderingChange}
            options={[
              { label: '最新上架', value: '-created_at' },
              { label: '价格从低到高', value: 'price' },
              { label: '价格从高到低', value: '-price' },
              { label: '销量优先', value: '-sales' },
            ]}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingPage />
      ) : products.length === 0 ? (
        <EmptyState
          title="暂无商品"
          description="没有找到匹配的商品"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
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
                    <h3 className="font-medium truncate mb-2" title={product.name}>
                      {product.name}
                    </h3>
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
                    <div className="mt-1">
                      {product.stock > 0 ? (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          有货
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          缺货
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {count > 20 && (
            <div className="mt-8">
              <Pagination
                current={page}
                total={count}
                pageSize={20}
                onChange={handlePageChange}
                showTotal={(total) => `共 ${total} 件商品`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ProductsContent />
    </Suspense>
  )
}
