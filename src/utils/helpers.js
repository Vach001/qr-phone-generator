// Utility functions for the application
export const formatPhoneNumber = (value) => {
  return value.replace(/\D/g, '')
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export const generateFilename = (phoneNumber, extension = 'png') => {
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const timestamp = new Date().toISOString().slice(0, 10)
  return `qr-code-${cleanNumber}-${timestamp}.${extension}`
}