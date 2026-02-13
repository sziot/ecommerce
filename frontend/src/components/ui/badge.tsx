import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  count?: number
  showZero?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'red' | 'blue' | 'green'
}

const sizeStyles = {
  sm: 'min-w-[1.25rem] h-5 text-xs px-1',
  md: 'min-w-[1.5rem] h-6 text-sm px-1.5',
  lg: 'min-w-[1.75rem] h-7 text-base px-2',
}

const colorStyles = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, count = 0, showZero = false, size = 'md', color = 'red', children, ...props }, ref) => {
    const shouldShow = showZero || count > 0

    return (
      <div ref={ref} className="relative inline-flex items-center" {...props}>
        {children}
        {shouldShow && (
          <span
            className={cn(
              'absolute -top-2 -right-2 flex items-center justify-center',
              'rounded-full text-white font-bold',
              'transform scale-100',
              sizeStyles[size],
              colorStyles[color],
              className
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
