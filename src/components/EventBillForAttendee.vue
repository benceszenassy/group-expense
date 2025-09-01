<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { computed } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseCallout from './BaseCallout.vue'

const props = defineProps<{
  attendeeId: string
  eventId: string
}>()

const eventsStore = useEventsStore()

const event = computed(
  () => (eventsStore.events.find((_event) => _event.id === props.eventId) ?? null) as IEvent,
)
const paidIn = computed(() =>
  event.value.expenses.filter((_event) => _event.paidBy === props.attendeeId),
)
const owedIn = computed(() =>
  event.value.expenses.filter((_event) => _event.splitAmong.includes(props.attendeeId)),
)
</script>

<template>
  <BaseCallout type="error" title="These expenses paid by attendee, they will be removed" />

  <BaseTable
    :columns="[
      { key: 'name', label: 'Name' },
      { key: 'amount', label: `Amount (${event.currency})` },
    ]"
    :data="paidIn"
  />

  <BaseCallout class="warn-callout" type="warn" title="These expenses will be modified" />
  <BaseTable
    :columns="[
      { key: 'name', label: 'Name' },
      { key: 'amount', label: `Amount (${event.currency})` },
    ]"
    :data="owedIn"
  />
</template>

<style scoped>
.warn-callout {
  margin-top: 3rem;
}
</style>
