<script setup lang="ts">
import { useEventsStore, type IEvent } from '@/stores/events'
import { useRoute } from 'vue-router'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const eventsStore = useEventsStore()
const route = useRoute()

const event = (eventsStore.events.find((_event) => _event.id === route.params.id) ?? null) as IEvent

const qrcode = useQRCode(JSON.stringify(event))
</script>

<template>
  <h2>Share: {{ event.name }}</h2>

  <img :src="qrcode" />
</template>
