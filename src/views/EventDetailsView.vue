<script setup lang="ts">
import { useEventsStore } from '@/stores/events'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const eventStore = useEventsStore()
const router = useRouter()

const event = eventStore.selectedEvent!

onMounted(() => {
  if (!eventStore.selectedEvent) {
    router.push({ name: 'events' })
    return
  }
})
</script>

<template>
  <template v-if="event">
    <h2>Details: {{ event.name }}</h2>
  </template>
</template>
