export const toPublicId = (rawId: string) =>
  `goal-${String(rawId).padStart(3, "0")}`;

export const fromPublicId = (publicId: string) =>
  publicId.replace(/^goal-/, "").replace(/^0+(?=\d)/, "");
