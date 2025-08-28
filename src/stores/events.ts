import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'

interface IEvent {
  id: string
  name: string
}

export const useEventsStore = defineStore('events', () => {
  const events = ref<IEvent[]>([
    {
      id: crypto.randomUUID(),
      name: 'Example',
    },
  ])
  const selectedEvent = ref<IEvent | null>(null)

  function selectEvent(eventId: string) {
    const _selectedEvent = events.value.find((event) => event.id === eventId)

    if (!_selectedEvent) {
      console.warn(`No event with id: ${eventId}!`)
      selectedEvent.value = null
      return
    }
    selectedEvent.value = _selectedEvent
  }

  function exportEvents() {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(events.value)]))
    a.download = `group-expense-export_${new Date().toISOString()}.json`
    a.click()
    a.remove()
  }

  function importEvents(text: string) {
    try {
      const _events = JSON.parse(text)
      // TODO: validate

      events.value = _events
    } catch (error) {
      console.error(error)
    }
  }

  return {
    events: readonly(events),
    selectedEvent: readonly(selectedEvent),
    selectEvent,
    exportEvents,
    importEvents,
  }
})
