<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import formatEvent from '@/utils/format-event'
import calculateTransactions from '@/utils/calculate-transactions'

const eventsStore = useEventsStore()
const route = useRoute()

const event = (eventsStore.events.find((_event) => _event.id === route.params.id) ?? null) as IEvent

const expenses = computed(() => formatEvent(event).expenses)
const stats = computed(() => calculateTransactions(event))
</script>

<template>
  <h2>Bill: {{ event.name }}</h2>

  <h3>Expenses</h3>
  <table class="striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Amount ({{ event.currency }})</th>
        <th>Payed by</th>
        <th>Should pay</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="expense in expenses" :key="expense.id">
        <td>
          {{ expense.name }}
        </td>
        <td>
          {{ expense.amount }}
        </td>
        <td>
          {{ expense.payedBy }}
        </td>
        <td>
          {{ expense.payers }}
        </td>
      </tr>
    </tbody>
  </table>

  <h3>Balances</h3>
  <table class="striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Balance ({{ event.currency }})</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="balance in stats.netBalances" :key="balance.attendee.id">
        <td>
          {{ balance.attendee.name }}
        </td>
        <td>{{ balance.balance }}</td>
      </tr>
    </tbody>
  </table>

  <h3>Transactions</h3>
  <table class="striped">
    <thead>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Amount ({{ event.currency }})</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in stats.transactions" :key="transaction.from.id + transaction.to.id">
        <td>
          {{ transaction.from.name }}
        </td>
        <td>
          {{ transaction.to.name }}
        </td>
        <td>{{ transaction.amount }}</td>
      </tr>
    </tbody>
  </table>
</template>
