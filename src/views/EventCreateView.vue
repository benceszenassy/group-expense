<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRouter } from 'vue-router'
import EventForm from '@/components/EventForm.vue'

const router = useRouter()
const eventsStore = useEventsStore()

function onSubmit(event: IEvent) {
  eventsStore.createEvent(event)

  eventsStore.selectEvent(event.id)
  router.push({
    name: 'event-details',
    params: {
      id: event.id,
    },
  })
}
</script>

<template>
  <h2>Create</h2>

  <EventForm @save="onSubmit" />
</template>
