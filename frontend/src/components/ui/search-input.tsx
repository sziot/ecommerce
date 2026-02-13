import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
}

export function SearchInput({ placeholder = '搜索...', onSearch, className }: SearchInputProps) {
  const [value, setValue] = useState('')

  const handleSearch = () => {
    onSearch(value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="button" variant="primary" onClick={handleSearch} className="ml-2">
        搜索
      </Button>
    </div>
  )
}
