import type { Goal } from "~/types/savings";

export function goalSaved(goal: Goal): number {
  return goal.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
}

export function parseDeadline(value: string | null | undefined): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
