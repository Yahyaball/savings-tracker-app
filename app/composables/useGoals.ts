import { ID, Permission, Query, Role, type Models } from "appwrite";
import type { ZodIssue } from "zod";
import type { Deposit, Goal } from "~/types/savings";
import { DepositInput, DepositsSchema, GoalInput } from "~/utils/goalSchema";

interface GoalRow extends Models.Row {
  name: string;
  target: number;
  deadline: string | null;
  deposits: string | null;
  userId: string;
}

function parseDeposits(value: string | null): Deposit[] {
  if (!value) return [];
  try {
    const parsed = DepositsSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function toDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toGoal(row: GoalRow): Goal {
  return {
    id: row.$id,
    name: row.name,
    target: row.target,
    deadline: row.deadline ?? null,
    createdAt: row.$createdAt,
    deposits: parseDeposits(row.deposits),
  };
}

export function useGoalActions() {
  const { user, fetchUser } = useAuth();
  const { $tables } = useNuxtApp();
  const { databaseId, goalsTableId } = useRuntimeConfig().public.appwrite;

  const requireConfig = () => {
    if (!databaseId || !goalsTableId) {
      throw new Error(
        "Appwrite is misconfigured: set APPWRITE_DATABASE_ID and APPWRITE_GOALS_TABLE_ID in .env",
      );
    }
  };

  const requireUserId = async () => {
    const account = user.value ?? (await fetchUser());
    if (!account) throw new Error("Not authenticated");
    return account.$id;
  };

  const createGoal = async (input: unknown): Promise<ZodIssue[] | null> => {
    const parsed = GoalInput.safeParse(input);
    if (!parsed.success) return parsed.error.issues;
    requireConfig();
    const userId = await requireUserId();
    await $tables.createRow({
      databaseId,
      tableId: goalsTableId,
      rowId: ID.unique(),
      data: {
        name: parsed.data.name,
        target: parsed.data.target,
        deadline: toDateTime(parsed.data.deadline),
        deposits: JSON.stringify([]),
        userId,
      },
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
    await refreshNuxtData("goals");
    return null;
  };

  const updateGoal = async (
    goalId: string,
    input: unknown,
  ): Promise<ZodIssue[] | null> => {
    const parsed = GoalInput.safeParse(input);
    if (!parsed.success) return parsed.error.issues;
    requireConfig();
    await $tables.updateRow({
      databaseId,
      tableId: goalsTableId,
      rowId: goalId,
      data: {
        name: parsed.data.name,
        target: parsed.data.target,
        deadline: toDateTime(parsed.data.deadline),
      },
    });
    await refreshNuxtData("goals");
    return null;
  };

  const deleteGoal = async (goalId: string) => {
    requireConfig();
    await $tables.deleteRow({
      databaseId,
      tableId: goalsTableId,
      rowId: goalId,
    });
    await refreshNuxtData("goals");
  };

  const addDeposit = async (
    goalId: string,
    input: unknown,
  ): Promise<ZodIssue[] | null> => {
    const parsed = DepositInput.safeParse(input);
    if (!parsed.success) return parsed.error.issues;
    requireConfig();
    const row = (await $tables.getRow({
      databaseId,
      tableId: goalsTableId,
      rowId: goalId,
    })) as unknown as GoalRow;
    const deposit: Deposit = {
      id: ID.unique(),
      amount: parsed.data.amount,
      note: parsed.data.note ?? "",
      createdAt: new Date().toISOString(),
    };
    await $tables.updateRow({
      databaseId,
      tableId: goalsTableId,
      rowId: goalId,
      data: {
        deposits: JSON.stringify([...parseDeposits(row.deposits), deposit]),
      },
    });
    await refreshNuxtData("goals");
    return null;
  };

  return { createGoal, updateGoal, deleteGoal, addDeposit };
}

export async function useGoals() {
  const { user, fetchUser } = useAuth();
  const { $tables } = useNuxtApp();
  const { databaseId, goalsTableId } = useRuntimeConfig().public.appwrite;

  const fetchGoals = async (): Promise<Goal[]> => {
    const account = user.value ?? (await fetchUser());
    if (!account) return [];
    if (!databaseId || !goalsTableId) {
      throw new Error(
        "Appwrite is misconfigured: set APPWRITE_DATABASE_ID and APPWRITE_GOALS_TABLE_ID in .env",
      );
    }
    try {
      const { rows } = await $tables.listRows({
        databaseId,
        tableId: goalsTableId,
        queries: [
          Query.equal("userId", account.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      });
      return (rows as unknown as GoalRow[]).map(toGoal);
    } catch (error) {
      const appwriteError = error as {
        type?: string;
        code?: number;
        message?: string;
      };
      console.error(
        `[useGoals] listRows failed for database "${databaseId}" table "${goalsTableId}": ` +
          `${appwriteError.type ?? "unknown"} (${appwriteError.code ?? "?"}) ` +
          `${appwriteError.message ?? String(error)}`,
        error,
      );
      throw error;
    }
  };

  const { data: goals, error, status, refresh } = await useAsyncData<Goal[]>(
    "goals",
    fetchGoals,
    { server: false, default: () => [] },
  );

  return { goals, error, status, refresh, ...useGoalActions() };
}
