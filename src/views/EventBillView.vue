<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import formatEvent from '@/utils/format-event'
import calculateTransactions from '@/utils/calculate-transactions'
import BaseTable from '@/components/BaseTable.vue'

const eventsStore = useEventsStore()
const route = useRoute()

const event = (eventsStore.events.find((_event) => _event.id === route.params.id) ?? null) as IEvent

const expenses = computed(() => formatEvent(event).expenses)
const stats = computed(() => calculateTransactions(event))
</script>

<template>
  <h2>Bill: {{ event.name }}</h2>

  <BaseTable
    title="Expenses"
    :columns="[
      { key: 'name', label: 'Name' },
      { key: 'amount', label: `Amount (${event.currency})` },
      { key: 'paidBy', label: `Paid by` },
      { key: 'splitAmong', label: `Split among` },
    ]"
    :data="expenses"
  />

  <BaseTable
    title="Balances"
    :columns="[
      { key: 'attendee.name', label: 'Name' },
      { key: 'balance', label: `Amount (${event.currency})` },
    ]"
    :data="stats.netBalances"
  />

  <BaseTable
    title="Transactions"
    :columns="[
      { key: 'from.name', label: 'From' },
      { key: 'to.name', label: 'To' },
      { key: 'amount', label: `Amount (${event.currency})` },
    ]"
    :data="stats.transactions"
  />
</template>
