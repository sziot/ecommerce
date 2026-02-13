import Link from 'next/link'
import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h5 className="text-lg font-semibold mb-4">关于我们</h5>
            <p className="text-gray-400">
              我们致力于为用户提供优质的购物体验，精选商品，优质服务。
            </p>
            <div className="flex gap-4 mt-4">
              <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">快速链接</h5>
            <div className="flex flex-col space-y-2">
              <Link href="/products" className="text-gray-400 hover:text-white">
                全部商品
              </Link>
              <Link href="/cart" className="text-gray-400 hover:text-white">
                购物车
              </Link>
              <Link href="/orders" className="text-gray-400 hover:text-white">
                我的订单
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-lg font-semibold mb-4">客户服务</h5>
            <div className="flex flex-col space-y-2">
              <Link href="#" className="text-gray-400 hover:text-white">
                帮助中心
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                退换货政策
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                配送说明
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                联系我们
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-4">联系我们</h5>
            <div className="text-gray-400 space-y-2">
              <p>电话: 400-123-4567</p>
              <p>邮箱: service@ecommerce.com</p>
              <p>工作时间: 周一至周日 9:00-21:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 电商平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
