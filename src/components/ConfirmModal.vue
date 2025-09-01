<script setup lang="ts">
import type { Component } from 'vue'

export type ConfirmModalProps = {
  title: string
  cancelButtonLabel: string
  acceptButtonLabel: string
  acceptButtonDanger?: boolean
  onCancel: () => void
  onAccept: () => void
  slots?: {
    default?: {
      component: string | Component
      props?: Record<string, any>
    }
  }
}

const props = defineProps<ConfirmModalProps>()

function close() {
  props.onCancel()
}
</script>

<template>
  <dialog open>
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="close"></button>
        <p>
          <strong>{{ title }}</strong>
        </p>
      </header>
      <template v-if="slots?.default">
        <div v-if="typeof slots.default.component === 'string'" v-html="slots.default" />
        <component
          :is="slots.default.component"
          v-bind="{ ...(slots.default.props ?? {}) }"
          v-else
        />
      </template>
      <footer>
        <button class="secondary" @click="close">{{ cancelButtonLabel }}</button>
        <button :class="[{ 'delete-button': acceptButtonDanger }]" @click="onAccept">
          {{ acceptButtonLabel }}
        </button>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>
.delete-button {
  --pico-background-color: var(--pico-form-element-invalid-border-color) !important;
  --pico-border-color: var(--pico-form-element-invalid-border-color) !important;
}
</style>
