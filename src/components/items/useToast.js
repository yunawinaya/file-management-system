// useToast.js
import { ref } from 'vue'

const toasts = ref([])

const addToast = (message, type = 'info', duration = 3000) => {
  toasts.value.push({ message, type, duration })
  setTimeout(() => {
    toasts.value.shift()
  }, duration)
}

export function useToast() {
  return {
    toasts,
    addToast,
  }
}
