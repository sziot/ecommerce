import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  showTotal?: (total: number) => string
}

export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showTotal,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (current >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {showTotal && <span className="text-sm text-gray-600 mr-4">{showTotal(total)}</span>}

      <Button
        variant="default"
        size="sm"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {typeof page === 'number' ? (
            <Button
              key={page}
              variant={page === current ? 'primary' : 'default'}
              size="sm"
              onClick={() => onChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={page} className="px-2 text-gray-400">
              {page}
            </span>
          )}
        </div>
      ))}

      <Button
        variant="default"
        size="sm"
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
