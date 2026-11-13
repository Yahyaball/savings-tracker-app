function toLetters(index: number): string {
  let n = index + 1;
  let letters = "";
  while (n > 0) {
    n--;
    letters = String.fromCharCode(97 + (n % 26)) + letters;
    n = Math.floor(n / 26);
  }
  return letters;
}

export function nextDepositId(
  rawId: string,
  deposits: { id: string }[],
): string {
  const used = new Set(deposits.map((deposit) => deposit.id));
  let index = deposits.length;
  while (used.has(`dep-${rawId}-${toLetters(index)}`)) index++;
  return `dep-${rawId}-${toLetters(index)}`;
}
