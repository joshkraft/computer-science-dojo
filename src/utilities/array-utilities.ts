export function generateRandomArray(
  length = 10,
  min = -10,
  max = 10
): number[] {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }

  return arr;
}
