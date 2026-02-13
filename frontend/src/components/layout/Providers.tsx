'use client'

/**
 * 全局 Providers 容器
 * 用于包裹需要全局访问的上下文提供者
 * 例如：主题、状态管理、认证等
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
