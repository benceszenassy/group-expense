import { ref, readonly } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export interface IAttendee {
  id: string
  name: string
}

export interface IExpense {
  id: string
  name: string
  amount: number
  payers: IAttendee['id'][]
  payedBy: IAttendee['id']
}

export interface IEvent {
  id: string
  name: string
  date?: Date
  attendees: IAttendee[]
  expenses: IExpense[]
  currency: string
}

export function createEmptyEvent() {
  return {
    id: crypto.randomUUID(),
    name: '',
    date: undefined,
    currency: 'HUF',
    attendees: [],
    expenses: [],
  } as IEvent
}

export function createEmptyExpense() {
  return {
    id: crypto.randomUUID(),
    name: '',
    amount: 0,
    payedBy: '',
    payers: [],
  } as IExpense
}

export const useEventsStore = defineStore('events', () => {
  const events = useLocalStorage<IEvent[]>('group_expense__events', [])
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

  function createEvent(event: IEvent) {
    events.value.push(event)
  }

  function removeEvent(id: string) {
    events.value = events.value.filter((event) => event.id !== id)
  }

  function saveEvent(event: IEvent) {
    const _eventId = events.value.findIndex((event) => event.id === event.id)

    if (_eventId === -1) {
      console.warn('Event not found with name (%s) and id (%s).', event.name, event.id)
      return
    }

    events.value[_eventId].name = event.name
    events.value[_eventId].attendees = event.attendees
    events.value[_eventId].expenses = event.expenses
  }

  return {
    events: readonly(events),
    createEvent,
    removeEvent,
    saveEvent,
    selectedEvent: readonly(selectedEvent),
    selectEvent,
    exportEvents,
    importEvents,
  }
})
