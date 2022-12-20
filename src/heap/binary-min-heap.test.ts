import {BinaryMinHeap} from './binary-min-heap';

describe('Binary Min Heap', () => {
  let heap: BinaryMinHeap;

  beforeEach(() => {
    heap = new BinaryMinHeap();
  });

  test('should keep track of the min value in the heap', () => {
    for (let i = 10; i >= 0; i--) {
      heap.push(i);
      heap.print();
      expect(heap.peek()).toEqual(i);
    }
  });
});
