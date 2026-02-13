import { forwardRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  allowClear?: boolean
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, placeholder = '请选择', className, allowClear = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.('')
    }

    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-between w-full h-10 px-3',
            'border border-gray-300 rounded-md bg-white',
            'text-sm text-left',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors',
            className
          )}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {allowClear && selectedOption && (
              <span
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ×
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer transition-colors',
                    'hover:bg-gray-100',
                    option.value === value && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.value === value && <Check className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
