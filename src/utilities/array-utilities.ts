import {getRandomInteger} from './number-utilities';

export function generateRandomArray(
  length = 10,
  min = -10,
  max = 10
): number[] {
  const arr: number[] = [];

  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }

  return arr;
}

export function generateSortedArray(min = -10, max = 10): number[] {
  const arr: number[] = [];

  for (let i = min; i <= max; i++) {
    arr.push(i);
  }

  return arr;
}

export function generateSortedRandomArray(
  min = -10,
  max = 10,
  skipProbability = 0.5,
  atLeastOneItem = true
): number[] {
  const arr: number[] = [];

  if (atLeastOneItem) {
    arr.push(min);
    min++;
  }

  for (let i = min; i < max; i++) {
    if (Math.random() < skipProbability) {
      continue;
    }

    arr.push(i);
  }

  return arr;
}

export function generateSparseArray(items: any[], sparcity = 10) {
  const outputLength = items.length * sparcity;
  const output: any[] = new Array(outputLength).fill(null);

  for (const item of items) {
    let randomIdx = getRandomInteger(0, outputLength);

    while (output[randomIdx] !== null) {
      randomIdx = getRandomInteger(0, outputLength);
    }

    output[randomIdx] = item;
  }

  return output;
}
