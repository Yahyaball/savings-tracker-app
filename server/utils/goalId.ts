export const toPublicId = (rawId: string) =>
  `goal-${String(rawId).padStart(3, "0")}`;
