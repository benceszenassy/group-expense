import { useEventsStore } from '@/stores/events'
import type { NavigationGuardWithThis } from 'vue-router'

const idGuard: NavigationGuardWithThis<undefined> = (to, from) => {
  if (!to.params.id) {
    return {
      ...from,
      query: {
        error: 'missing-event-id',
      },
    }
  }

  const eventsStore = useEventsStore()
  if (!eventsStore.events.find((event) => event.id === to.params.id)) {
    return {
      ...from,
      query: {
        error: 'event-not-found',
      },
    }
  }
}

export default idGuard
