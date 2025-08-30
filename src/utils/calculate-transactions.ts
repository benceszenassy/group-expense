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
    const { amount, payedBy, payers } = expense
    const share = amount / payers.length

    // Credit the payer
    balances[payedBy] ??= {
      attendee: event.attendees.find((attendee) => attendee.id === payedBy)!,
      amount: 0,
    }

    balances[payedBy].amount += amount

    // Debit each participant
    for (const payer of payers) {
      balances[payer] ??= {
        attendee: event.attendees.find((attendee) => attendee.id === payer)!,
        amount: 0,
      }

      balances[payer].amount -= share
    }
  }

  // Step 2: Convert balances to array
  const netBalances = Object.keys(balances)
    .map((id) => ({ ...balances[id], balance: parseFloat(balances[id].amount.toFixed(2)) }))
    .filter((netBalance) => Math.abs(netBalance.balance) > 0.01)

  const transactions: IPath[] = []

  // Step 3: Backtracking function
  function dfs(start: number, currentBalances: INetBalance[], path: IPath[]) {
    while (start < currentBalances.length && Math.abs(currentBalances[start].balance) < 0.01) {
      start++
    }

    if (start === currentBalances.length) {
      if (transactions.length === 0 || path.length < transactions.length) {
        transactions.length = 0
        path.forEach((p) => transactions.push(p))
      }
      return
    }

    for (let i = start + 1; i < currentBalances.length; i++) {
      const a = currentBalances[start]
      const b = currentBalances[i]
      if (a.balance * b.balance < 0) {
        const amount = Math.min(Math.abs(a.balance), Math.abs(b.balance))
        const origA = a.balance,
          origB = b.balance

        // Settle a with b
        a.balance += a.balance > 0 ? -amount : amount
        b.balance += b.balance > 0 ? -amount : amount

        path.push({
          from: a.balance < 0 ? a.attendee : b.attendee,
          to: a.balance < 0 ? b.attendee : a.attendee,
          amount: parseFloat(amount.toFixed(2)),
        })

        dfs(start + 1, currentBalances, path)

        // Backtrack
        path.pop()
        a.balance = origA
        b.balance = origB
      }
    }
  }

  dfs(0, [...netBalances], [])

  return { netBalances, transactions }
}
