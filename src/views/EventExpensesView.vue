<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRoute } from 'vue-router'
import ExpenseForm from '@/components/ExpenseForm.vue'

const eventsStore = useEventsStore()
const route = useRoute()

const event = (eventsStore.events.find((_event) => _event.id === route.params.id) ?? null) as IEvent

function onSubmit(event: IEvent) {
  eventsStore.saveEvent(event)
}
</script>

<template>
  <h2>Details: {{ event.name }}</h2>

  <ExpenseForm :event="event" @save="onSubmit" />
</template>
