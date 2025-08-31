import type { IEvent, IExpense } from '@/stores/events'

export interface IFormattedEvent extends Omit<IEvent, 'expenses'> {
  expenses: (Omit<IExpense, 'splitAmong'> & {
    splitAmong: string
  })[]
}

export default function formatEvent(event: IEvent) {
  const formattedExpenses = event.expenses.map((_expense) => {
    return {
      id: _expense.id,
      name: _expense.name,
      amount: _expense.amount,
      paidBy: event.attendees.find((attendee) => attendee.id === _expense.paidBy)!.name,
      splitAmong: (_expense.splitAmong ?? [])
        .map((attendeeId) => event.attendees.find((attendee) => attendee.id === attendeeId)!.name)
        .join(', '),
    }
  }) as IFormattedEvent['expenses']

  const _event = JSON.parse(JSON.stringify(event)) as unknown as IFormattedEvent
  _event.expenses = formattedExpenses
  return _event
}
