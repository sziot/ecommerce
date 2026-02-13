'use client'

import { HTMLAttributes, createContext, useContext, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface DropdownContextValue {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  toggle: () => void
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined)

function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown')
  }
  return context
}

export interface DropdownProps {
  children: React.ReactNode
}

export function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  )
}

export interface DropdownTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function DropdownTrigger({ asChild = false, className, children, ...props }: DropdownTriggerProps) {
  const { isOpen, toggle } = useDropdown()

  if (asChild) {
    return <div onClick={toggle}>{children}</div>
  }

  return (
    <button
      onClick={toggle}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end'
}

export function DropdownContent({ className, children, align = 'end', ...props }: DropdownContentProps) {
  const { isOpen, setIsOpen } = useDropdown()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const alignClasses = align === 'end' ? 'right-0' : 'left-0'

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
        alignClasses,
        className
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
}

export function DropdownItem({ className, children, onClick, ...props }: DropdownItemProps) {
  const { setIsOpen } = useDropdown()

  const handleClick = () => {
    onClick?.()
    setIsOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownSeparator({ className }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t border-gray-100 my-1', className)} />
}
