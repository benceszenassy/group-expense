import type { IAttendee, IEvent } from '@/stores/events'

interface IPath {
  from: IAttendee
  to: IAttendee
  amount: number
}

interface INetBalance {
  balance: number
  attendee: IAttendee
  amount: number
}

export default function calculateTransactions(event: IEvent) {
  const balances: Record<
    string,
    {
      attendee: IAttendee
      amount: number
    }
  > = {}
  event.attendees.forEach(
    (attendee) =>
      (balances[attendee.id] = {
        attendee,
        amount: 0,
      }),
  )

  // Step 1: Calculate net balances
  for (const expense of event.expenses) {
    const { amount, paidBy, splitAmong } = expense
    const share = amount / splitAmong.length

    // Credit the payer
    balances[paidBy] ??= {
      attendee: event.attendees.find((attendee) => attendee.id === paidBy)!,
      amount: 0,
    }

    balances[paidBy].amount += amount

    // Debit each participant
    for (const payer of splitAmong) {
      balances[payer] ??= {
        attendee: event.attendees.find((attendee) => attendee.id === payer)!,
        amount: 0,
      }

      balances[payer].amount -= share
    }
  }

  const netBalances = Object.keys(balances)
    .map((id) => ({ ...balances[id], balance: parseFloat(balances[id].amount.toFixed(2)) }))
    .filter((netBalance) => Math.abs(netBalance.balance) > 0.01)

  const _netBalances = JSON.parse(JSON.stringify(netBalances)) as INetBalance[]

  // Step 2: Split attendees to debtors and creditors
  const debtors = _netBalances
    .filter((attendee) => attendee.balance < 0)
    .sort((a, b) => (a.balance > b.balance ? 1 : -1))
  const creditors = _netBalances
    .filter((attendee) => attendee.balance > 0)
    .sort((a, b) => (a.balance < b.balance ? 1 : -1))

  const transactions: IPath[] = []

  // Step 3: Calculate transactions
  // biggest debtor pays biggest creditor to lowest debtor pays lowest creditor logic
  debtors.forEach((debtor) => {
    while (debtor.balance < 0) {
      const creditor = creditors[0]
      if (!creditor) throw new Error('No creditor left')

      const amount = Math.max(debtor.balance, -creditor.balance)

      creditor.balance += amount
      if (isRoundingError(creditor.balance)) {
        creditor.balance = 0
      }

      debtor.balance -= amount
      if (isRoundingError(debtor.balance)) {
        debtor.balance = 0
      }

      if (creditor.balance === 0) {
        creditors.shift()
      }

      transactions.push({
        amount,
        to: creditor.attendee,
        from: debtor.attendee,
      })
    }
  })

  return { netBalances, transactions }
}

function isRoundingError(amount: number) {
  const _amount = Math.abs(amount)
  return _amount < 0.1 && _amount > 0
}
