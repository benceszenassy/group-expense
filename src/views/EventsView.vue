<script setup lang="ts">
import { useEventsStore } from '@/stores/events'

const eventsStore = useEventsStore()
</script>

<template>
  <h1>Events</h1>

  <details v-for="event in eventsStore.events" :key="event.id" name="events" open>
    <summary>{{ event.name }}</summary>
    <pre>{{ JSON.stringify(event, null, 2) }}</pre>
    <RouterLink
      :to="{
        name: 'event-details',
        params: {
          id: event.id,
        },
      }"
      custom
      v-slot="{ navigate }"
    >
      <button
        class="full-width"
        @click="
          () => {
            eventsStore.selectEvent(event.id)
            navigate()
          }
        "
        @keypress.enter="
          () => {
            eventsStore.selectEvent(event.id)
            navigate()
          }
        "
        role="link"
      >
        Details
      </button>
    </RouterLink>
  </details>

  <RouterLink :to="{ name: 'event-create' }" custom v-slot="{ navigate }">
    <button class="full-width" @click="navigate" @keypress.enter="() => navigate()" role="link">
      Add new
    </button>
  </RouterLink>

  <div role="group">
    <button
      class="outline contrast"
      @click="eventsStore.exportEvents"
      :disabled="!eventsStore.events.length"
    >
      Export
    </button>
    <button
      class="outline contrast"
      @click="
        () => eventsStore.importEvents(JSON.stringify([{ id: 'kiskutya', name: 'importált' }]))
      "
    >
      Import
    </button>
  </div>
</template>
