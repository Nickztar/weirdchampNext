export function ShuffleArray<T>(unshuffled: T[]): T[] {
  const shuffled = unshuffled
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
  return shuffled;
}
