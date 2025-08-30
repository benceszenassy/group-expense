<script setup lang="ts">
import { createEmptyEvent, type IEvent } from '@/stores/events'
import { computed, provide, reactive, ref } from 'vue'
import InputField from '@/components/InputField.vue'

const props = withDefaults(
  defineProps<{
    event?: IEvent
    readonly?: boolean
  }>(),
  {
    event: () => createEmptyEvent(),
  },
)
provide(
  'readonly',
  computed(() => props.readonly),
)

const emits = defineEmits<{
  save: [event: IEvent]
}>()

const newEvent = reactive<IEvent>({ ...props.event })
const newAttendee = ref('')

function removeAttendee(id: string) {
  newEvent.attendees = newEvent.attendees.filter((attendee) => attendee.id !== id)
}

function addAttendee() {
  newEvent.attendees.push({
    id: crypto.randomUUID(),
    name: newAttendee.value,
  })

  newAttendee.value = ''
}

const errors = computed(() => {
  const _errors: Partial<Record<keyof IEvent, string>> = {}

  if (!newEvent.name) {
    _errors.name = 'Required'
  }

  if (!newEvent.attendees.length) {
    _errors.attendees = 'Required'
  }

  if (!newEvent.currency.length) {
    _errors.currency = 'Required'
  }

  return _errors
})
provide('errors', errors)

const canSave = computed(() => !Object.keys(errors).length && !props.readonly)

function onSubmit(event: Event) {
  event.preventDefault()
  emits('save', newEvent)
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid">
      <InputField name="name" label="Name" v-model.trim="newEvent.name" />

      <InputField name="date" label="Date" type="datetime-local" v-model="newEvent.date" />

      <InputField name="currency" label="Currency" v-model.trim="newEvent.currency" />

      <label for="newAttendee">Add attendee </label>
      <fieldset role="group">
        <input
          type="text"
          name="newAttendee"
          v-model="newAttendee"
          :aria-invalid="!!errors.attendees"
        />
        <button class="outline" :disabled="!newAttendee.length" @click="addAttendee">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"
            ></path>
          </svg>
        </button>
      </fieldset>
      <small v-if="errors.attendees">{{ errors.attendees }}</small>

      <label for="attendees"> Attendees </label>
      <table class="striped">
        <tbody>
          <tr v-for="attendee in newEvent.attendees" :key="attendee.id">
            <td>
              {{ attendee.name }}
            </td>
            <td>
              <button
                class="outline"
                :aria-label="`Remove ${attendee.name} from attendees`"
                @click="() => removeAttendee(attendee.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" :disabled="canSave">Save</button>
    </div>
  </form>
</template>

<style scoped>
table tr td:last-of-type {
  display: flex;
  justify-content: flex-end;
}
</style>
