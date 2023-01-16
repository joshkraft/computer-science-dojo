export function getRandomInteger(min: number, max: number): number {
  const maxInclusive = max + 1;

  const randomNum = Math.random() * (maxInclusive - min) + min;

  return Math.floor(randomNum);
}
