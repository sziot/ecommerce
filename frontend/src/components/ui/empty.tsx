import { Package } from 'lucide-react'

/**
 * 空状态组件（替代 antd Empty）
 */
export function EmptyState({
  icon = <Package className="w-12 h-12" />,
  title = '暂无数据',
  description,
  action,
}: {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  )
}
