import {Heap, HeapType} from './heap';

describe('Heap', () => {
  describe('Min Heap', () => {
    let minHeap: Heap;

    beforeEach(() => {
      minHeap = new Heap(HeapType.Min);
    });

    describe('constructor()', () => {
      test('should create a Heap that has a heap array and an inCorrectOrder function', () => {
        expect(minHeap.heap).toBeDefined();
        expect(minHeap.inCorrectOrder).toBeDefined();
      });
    });

    describe('push()', () => {
      test('should add items to the heap', () => {
        minHeap.push(1);
        expect(minHeap.heap).toContain(1);

        minHeap.push(2);
        expect(minHeap.heap).toContain(2);

        minHeap.push(3);
        expect(minHeap.heap).toContain(3);
      });
    });

    describe('peek()', () => {
      test('should return null if the heap is empty', () => {
        expect(minHeap.peek()).toBeNull();
      });

      test('should return the node with the smallest value in the heap', () => {
        minHeap.push(3);
        minHeap.push(2);
        minHeap.push(1);

        expect(minHeap.peek()).toBe(1);
      });
    });

    describe('poll()', () => {
      test('should return null if the heap is empty', () => {
        expect(minHeap.poll()).toBeNull();
      });

      test('should remove the node with the smallest value in the heap and return it', () => {
        minHeap.push(3);
        minHeap.push(2);
        minHeap.push(1);

        expect(minHeap.poll()).toBe(1);
        expect(minHeap.poll()).toBe(2);
        expect(minHeap.poll()).toBe(3);
        expect(minHeap.poll()).toBeNull();
      });
    });
  });

  describe('Max Heap', () => {
    let maxHeap: Heap;

    beforeEach(() => {
      maxHeap = new Heap(HeapType.Max);
    });

    describe('peek()', () => {
      test('should return null if the heap is empty', () => {
        expect(maxHeap.peek()).toBeNull();
      });

      test('should return the node with the largest value in the heap', () => {
        maxHeap.push(1);
        maxHeap.push(2);
        maxHeap.push(3);

        expect(maxHeap.peek()).toBe(3);
      });
    });

    describe('poll()', () => {
      test('should return null if the heap is empty', () => {
        expect(maxHeap.poll()).toBeNull();
      });

      test('should remove the node with the largest value in the heap and return it', () => {
        maxHeap.push(1);
        maxHeap.push(2);
        maxHeap.push(3);

        expect(maxHeap.poll()).toBe(3);
        expect(maxHeap.poll()).toBe(2);
        expect(maxHeap.poll()).toBe(1);
        expect(maxHeap.poll()).toBeNull();
      });
    });
  });
});
