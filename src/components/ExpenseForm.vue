<script setup lang="ts">
import { createEmptyExpense, type IEvent, type IExpense } from '@/stores/events'
import { computed, provide, reactive, ref } from 'vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import formatEvent from '@/utils/format-event'

const props = defineProps<{
  event: IEvent
}>()

const emits = defineEmits<{
  save: [event: IEvent]
}>()

const _event = reactive<IEvent>({ ...props.event })
const newExpense = ref<IExpense>(createEmptyExpense())
const isEdit = ref(false)

function editExpense(id: string) {
  newExpense.value = JSON.parse(
    JSON.stringify(_event.expenses.find((expense) => expense.id === id) ?? createEmptyExpense()),
  )
  isEdit.value = true
}

function removeExpense(id: string) {
  _event.expenses = _event.expenses.filter((expense) => expense.id !== id)
  emits('save', _event)
}

const errors = computed(() => {
  const _errors: Partial<Record<keyof IExpense, string>> = {}

  if (!newExpense.value.name) {
    _errors.name = 'Required'
  }

  if (newExpense.value.amount === undefined) {
    _errors.amount = 'Required'
  }

  if (newExpense.value.amount < 0) {
    _errors.amount = 'Must be a positive number'
  }

  if (!newExpense.value.payedBy) {
    _errors.payedBy = 'Required'
  }

  if (!newExpense.value.payers?.length) {
    _errors.payers = 'Required'
  }

  return _errors
})
provide('errors', errors)

const canAdd = computed(() => Object.keys(errors).length === 0)

function onSubmit(event: Event) {
  event.preventDefault()

  if (isEdit.value) {
    const index = _event.expenses.findIndex((expense) => expense.id === newExpense.value.id)
    _event.expenses.splice(index, 1, newExpense.value)
    isEdit.value = false
  } else {
    _event.expenses.push(newExpense.value)
  }
  emits('save', _event)

  newExpense.value = createEmptyExpense()
}

function onCancel() {
  isEdit.value = false
  newExpense.value = createEmptyExpense()
}

const expenses = computed(() => formatEvent(_event).expenses)
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid">
      <InputField name="name" label="Name" v-model.trim="newExpense.name" />

      <InputField name="date" label="Amount" type="number" v-model="newExpense.amount" />

      <SelectField
        name="payedBy"
        label="Payed by"
        v-model="newExpense.payedBy"
        :options="_event.attendees"
      />

      <SelectField
        name="payers"
        label="Who should pay"
        v-model="newExpense.payers"
        multiple
        :options="_event.attendees"
      />

      <button type="submit" :disabled="!canAdd.valueOf">{{ isEdit ? 'Save' : 'Add' }}</button>
      <button v-if="isEdit" class="outline" @click="onCancel">Cancel</button>
    </div>
  </form>

  <h3>Expenses</h3>
  <table class="striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Amount ({{ event.currency }})</th>
        <th>Payed by</th>
        <th>Should pay</th>
        <th></th>
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
        <td class="actions">
          <button
            class="outline"
            :aria-label="`Edit ${expense.name} expense`"
            @click="() => editExpense(expense.id)"
            :disabled="isEdit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"
              ></path>
            </svg>
          </button>
          <button
            class="outline delete"
            :aria-label="`Remove ${expense.name} from expenses`"
            @click="() => removeExpense(expense.id)"
            :disabled="isEdit"
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
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
}

.delete {
  --pico-color: var(--pico-form-element-invalid-border-color);
  --pico-border-color: var(--pico-form-element-invalid-border-color);
}
</style>
