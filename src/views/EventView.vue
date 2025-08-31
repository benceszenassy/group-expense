<script setup lang="ts">
import CustomRouterLink from '@/components/CustomRouterLink.vue'
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const eventsStore = useEventsStore()
const route = useRoute()

const event = computed(
  () => (eventsStore.events.find((_event) => _event.id === route.params.id) ?? null) as IEvent,
)
</script>

<template>
  <div v-if="event" class="container">
    <CustomRouterLink type="link" label="Details" name="event-details" :params="{ id: event.id }" />
    <CustomRouterLink
      type="link"
      label="Expenses"
      name="event-expenses"
      :params="{ id: event.id }"
    />
    <CustomRouterLink type="link" label="Bill" name="event-bill" :params="{ id: event.id }" />
    <CustomRouterLink type="link" label="Share" name="event-share" :params="{ id: event.id }" />
  </div>

  <RouterView />

  <CustomRouterLink label="Back" name="events" />
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding-bottom: 2rem;
}
</style>
