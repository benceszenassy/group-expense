<script setup lang="ts" generic="T">
import { inject } from 'vue'

const props = defineProps<{
  name: string
  label: string
  options: { id: string; name: string }[]
  optionalOptionLabel?: string
  multiple?: boolean
  modelValue: T
}>()

const emits = defineEmits<{
  'update:modelValue': [value: T]
}>()

const readonly = inject('readonly', false) as boolean
const errors = inject('errors') as Record<string, string>

function onChange(event: Event) {
  const values = Array.from((event.target as HTMLSelectElement).children)
    .filter((option) => (option as HTMLOptionElement).selected)
    .map((option) => (option as HTMLOptionElement).value)
    .filter(Boolean)

  if (props.multiple) {
    emits('update:modelValue', JSON.parse(JSON.stringify(values)) as T)
    return
  }

  emits('update:modelValue', values[0] as T)
}
</script>

<template>
  <label :for="name">{{ label }}</label>
  <select
    :name="name"
    :aria-invalid="!!errors[name]"
    v-bind="$attrs"
    @change="onChange"
    :readonly="readonly"
    :multiple="multiple"
  >
    <option value="">Select...</option>
    <option
      v-for="option in options"
      :key="option.id"
      :value="option.id"
      :selected="(modelValue as string[]).includes(option.id) || undefined"
    >
      {{ option.name }}
    </option>
  </select>
  <small v-if="errors[name]">{{ errors[name] }}</small>
</template>
