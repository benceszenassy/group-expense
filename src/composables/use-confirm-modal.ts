import type { ConfirmModalProps } from '@/components/ConfirmModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { markRaw, readonly, ref, type Component } from 'vue'

export type ConfirmModalComposableProps = {
  component: Component
  props: Omit<ConfirmModalProps, 'onCancel' | 'cancelButtonLabel'> & {
    onCancel?: ConfirmModalProps['onCancel']
    cancelButtonLabel?: string
  }
}

const modal = ref<ConfirmModalComposableProps | null>(null)

export default function useConfirmModal() {
  function open(props: ConfirmModalComposableProps['props']) {
    modal.value = {
      component: markRaw(ConfirmModal),
      props: {
        cancelButtonLabel: 'Cancel',
        ...props,
        onAccept: () => {
          modal.value = null
          props.onAccept()
        },
        onCancel: () => {
          modal.value = null
          props.onCancel?.()
        },
      },
    }
  }

  return {
    open,
    modal: readonly(modal),
  }
}
