/**
 * Toast 通知系统（替代 antd message）
 */
type ToastType = 'success' | 'error' | 'info' | 'warning'

let toastContainer: HTMLDivElement | null = null

interface ToastOptions {
  duration?: number
  onClose?: () => void
}

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className =
      'fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

function createToast(type: ToastType, message: string, options: ToastOptions = {}) {
  const container = ensureContainer()

  const toast = document.createElement('div')
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type]

  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 translate-x-full opacity-0`
  toast.textContent = message

  container.appendChild(toast)

  // 动画进入
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full', 'opacity-0')
  })

  // 自动移除
  const duration = options.duration ?? 3000
  const timer = setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0')
    setTimeout(() => {
      toast.remove()
      options.onClose?.()
      if (container.children.length === 0) {
        container.remove()
        toastContainer = null
      }
    }, 300)
  }, duration)

  // 点击关闭
  toast.addEventListener('click', () => {
    clearTimeout(timer)
    toast.classList.add('translate-x-full', 'opacity-0')
    setTimeout(() => {
      toast.remove()
      options.onClose?.()
      if (container.children.length === 0) {
        container.remove()
        toastContainer = null
      }
    }, 300)
  })
}

export const toast = {
  success: (message: string, options?: ToastOptions) => createToast('success', message, options),
  error: (message: string, options?: ToastOptions) => createToast('error', message, options),
  info: (message: string, options?: ToastOptions) => createToast('info', message, options),
  warning: (message: string, options?: ToastOptions) => createToast('warning', message, options),
}
