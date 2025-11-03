export function findPrevPot(n: number): number {
  if (n <= 1) return 1;
  return Math.pow(2, Math.floor(Math.log2(n)));
}
