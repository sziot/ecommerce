'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { useAuthStore } from '@/store/authStore'
import { useRequest } from '@/lib/hooks'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data: userData, loading } = useRequest<any>('/auth/me/', {
    immediate: isAuthenticated,
  })

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return <LoadingPage />
  }

  const displayData = userData || user

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-bold">个人中心</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>
          <div className="space-y-3">
            <div className="flex border-b pb-3">
              <span className="text-gray-500 w-24">用户名：</span>
              <span>{displayData?.username}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="text-gray-500 w-24">昵称：</span>
              <span>{displayData?.nickname || '-'}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="text-gray-500 w-24">邮箱：</span>
              <span>{displayData?.email}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="text-gray-500 w-24">手机号：</span>
              <span>{displayData?.phone || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">注册时间：</span>
              <span>
                {displayData?.date_joined
                  ? new Date(displayData.date_joined).toLocaleDateString('zh-CN')
                  : '-'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="primary">
              <Edit className="w-4 h-4 mr-2" />
              编辑资料
            </Button>
            <Button variant="default">修改密码</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
