<script setup lang="ts">
import { createEmptyExpense, type IEvent, type IExpense } from '@/stores/events'
import { computed, provide, reactive, ref } from 'vue'
import InputField from '@/components/InputField.vue'
import SelectField from '@/components/SelectField.vue'
import formatEvent from '@/utils/format-event'
import DeleteButton from './DeleteButton.vue'

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

  if (!newExpense.value.paidBy) {
    _errors.paidBy = 'Required'
  }

  if (!newExpense.value.splitAmong?.length) {
    _errors.splitAmong = 'Required'
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
        name="paidBy"
        label="Paid By"
        v-model="newExpense.paidBy"
        :options="_event.attendees"
      />

      <SelectField
        name="splitAmong"
        label="Split among"
        v-model="newExpense.splitAmong"
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
        <th>Paid By</th>
        <th>Split among</th>
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
          {{ expense.paidBy }}
        </td>
        <td>
          {{ expense.splitAmong }}
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
          <DeleteButton
            :ariaLabel="`Remove ${expense.name} from expenses`"
            @click="() => removeExpense(expense.id)"
            :disabled="isEdit"
          />
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
</style>
