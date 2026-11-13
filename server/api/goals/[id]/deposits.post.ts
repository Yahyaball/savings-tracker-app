import { z } from "zod";
import { getApiBaseUrl } from "~~/server/utils/apiBaseUrl";
import { nextDepositId } from "~~/server/utils/depositId";

export default defineEventHandler(async (event) => {
  const DepositInput = z.object({
    amount: z.number().gt(0, { message: "Amount must be greater than $0" }),
    note: z.string().optional(),
  });
  const body = await readValidatedBody(event, DepositInput.parse);
  const apiBaseUrl = getApiBaseUrl(event);
  const publicId = getRouterParam(event, "id");
  if (!publicId)
    throw createError({ statusCode: 400, statusMessage: "Missing goal id" });
  const rawId = fromPublicId(publicId);
  type StoredGoal = {
    deposits: { id: string; amount: number; note: string; createdAt: string }[];
  };
  const goal = await $fetch<StoredGoal>(`${apiBaseUrl}/${rawId}`);
  const deposit = {
    id: nextDepositId(rawId, goal.deposits),
    amount: body.amount,
    note: body.note ?? "",
    createdAt: new Date().toISOString(),
  };
  const updated = await $fetch<{ id: string }>(`${apiBaseUrl}/${rawId}`, {
    method: "PUT",
    body: { ...goal, deposits: [...goal.deposits, deposit] },
  });
  return { ...updated, id: toPublicId(updated.id) };
});
