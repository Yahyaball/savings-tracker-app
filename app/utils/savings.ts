import type { Goal } from '~/types/savings'

export function goalSaved(goal: Goal): number {
    return goal.deposits.reduce((sum, deposit) => sum + deposit.amount, 0)
}
