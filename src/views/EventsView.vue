<script setup lang="ts">
import useImportModal from '@/composables/use-import-modal'
import { useEventsStore } from '@/stores/events'
import ImportModal from '@/components/ImportModal.vue'

const eventsStore = useEventsStore()
const importModal = useImportModal()
</script>

<template>
  <h1>Events</h1>

  <details v-for="event in eventsStore.events" :key="event.id" name="events" open>
    <summary>{{ event.name }}</summary>
    <pre>{{ JSON.stringify(event, null, 2) }}</pre>
    <div role="group">
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
        <button @click="navigate" @keypress.enter="() => navigate()" role="link">Details</button>
      </RouterLink>
      <RouterLink
        :to="{
          name: 'event-expenses',
          params: {
            id: event.id,
          },
        }"
        custom
        v-slot="{ navigate }"
      >
        <button @click="navigate" @keypress.enter="() => navigate()" role="link">Expenses</button>
      </RouterLink>
      <RouterLink
        :to="{
          name: 'event-bill',
          params: {
            id: event.id,
          },
        }"
        custom
        v-slot="{ navigate }"
      >
        <button @click="navigate" @keypress.enter="() => navigate()" role="link">Bill</button>
      </RouterLink>
    </div>
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
    <button class="outline contrast" @click="importModal.open">Import</button>
  </div>

  <ImportModal />
</template>
