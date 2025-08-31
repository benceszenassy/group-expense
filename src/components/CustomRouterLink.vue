<script setup lang="ts">
import type { RoutesNames } from '@/router'

withDefaults(
  defineProps<{
    label?: string
    name: RoutesNames
    params?: { id: string }
    type?: 'button' | 'link'
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <RouterLink v-if="type === 'button'" :to="{ name, params }" custom v-slot="{ navigate }">
    <button class="full-width" @click="navigate" @keypress.enter="() => navigate()" role="link">
      <template v-if="label">
        {{ label }}
      </template>
      <slot></slot>
    </button>
  </RouterLink>
  <RouterLink v-else :to="{ name, params }">
    <template v-if="label">
      {{ label }}
    </template>
    <slot></slot>
  </RouterLink>
</template>
