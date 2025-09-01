<script setup lang="ts">
import useConfirmModal from '@/composables/use-confirm-modal'

const confirmModal = useConfirmModal()
</script>

<template>
  <component
    v-if="confirmModal.modal.value"
    :is="confirmModal.modal.value.component"
    v-bind="confirmModal.modal.value.props"
  />
</template>
