'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ShoppingCart, User, LogOut, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'
import { SearchInput } from '@/components/ui/search-input'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { totalItems } = useCartStore()

  const handleSearch = (value: string) => {
    if (value) {
      router.push(`/products?search=${value}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">电商平台</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <SearchInput
              placeholder="搜索商品"
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <Link href="/products" className="flex items-center gap-1 hover:text-blue-600">
              <Store className="w-5 h-5" />
              <span className="hidden sm:inline">全部商品</span>
            </Link>

            <Link href="/cart" className="flex items-center gap-1 hover:text-blue-600">
              <Badge count={totalItems} size="sm">
                <ShoppingCart className="w-5 h-5" />
              </Badge>
              <span className="ml-1 hidden sm:inline">购物车</span>
            </Link>

            {isAuthenticated ? (
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {user?.nickname || user?.username}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownContent align="end">
                  <DropdownItem asChild>
                    <Link href="/profile">个人中心</Link>
                  </DropdownItem>
                  <DropdownItem asChild>
                    <Link href="/orders">我的订单</Link>
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2 inline" />
                    退出登录
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="default">登录</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">注册</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-4 md:hidden">
          <SearchInput
            placeholder="搜索商品"
            onSearch={handleSearch}
          />
        </div>
      </div>
    </header>
  )
}
