import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'link' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const buttonVariants = {
  default: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
  link: 'bg-transparent text-blue-600 hover:underline p-0',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
