<script setup lang="ts">
defineProps<{
  title?: string
  columns: { key: string; label: string }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepLookup(obj: any, _path: string) {
  for (let i = 0, path = _path.split('.'), len = path.length; i < len; i++) {
    obj = obj[path[i]]
  }
  return obj
}
</script>

<template>
  <h3 v-if="title">{{ title }}</h3>
  <table class="striped">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="column in columns" :key="column.key">
          {{ deepLookup(row, column.key) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
