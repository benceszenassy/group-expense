import type { IEvent, IExpense } from '@/stores/events'

export interface IFormattedEvent extends Omit<IEvent, 'expenses'> {
  expenses: (Omit<IExpense, 'payers'> & {
    payers: string
  })[]
}

export default function formatEvent(event: IEvent) {
  const formattedExpenses = event.expenses.map((_expense) => {
    return {
      id: _expense.id,
      name: _expense.name,
      amount: _expense.amount,
      payedBy: event.attendees.find((attendee) => attendee.id === _expense.payedBy)!.name,
      payers: (_expense.payers ?? [])
        .map((payer) => event.attendees.find((attendee) => attendee.id === payer)!.name)
        .join(', '),
    }
  }) as IFormattedEvent['expenses']

  const _event = JSON.parse(JSON.stringify(event)) as unknown as IFormattedEvent
  _event.expenses = formattedExpenses
  return _event
}
