<script setup lang="ts">
import { inject } from 'vue'

defineProps<{
  name: string
  label: string
}>()

const model = defineModel()

const readonly = inject('readonly', false) as boolean
const errors = inject('errors') as Record<string, string>
</script>

<template>
  <label :for="name">{{ label }}</label>
  <input
    type="text"
    :name="name"
    :aria-invalid="!!errors[name]"
    v-bind="$attrs"
    v-model="model"
    :readonly="readonly"
  />
  <small v-if="errors[name]">{{ errors[name] }}</small>
</template>
