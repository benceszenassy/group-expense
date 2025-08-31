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

  <div class="img-container">
    <img :src="qrcode" />
  </div>
</template>

<style scoped>
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1rem 2rem 1rem;
}
</style>
