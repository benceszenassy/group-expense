import { computed, readonly, ref } from 'vue'

const isOpen = ref(false)

export default function useImportModal() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    open,
    close,
  }
}
