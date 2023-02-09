/**
 * HeapType.Min: Every parent nodes val <= its children's vals
 * HeapType.Max: Every parent nodes cal >= its children's vals
 */
export enum HeapType {
  Min,
  Max,
}

/**
 * Heap is an implementation of a heap data structure that uses an array to
 * represent a complete binary tree of items. This class can construct both
 * Min Heap and Max Heap depending on the argument provided to the constructor.
 *
 * The heap is notable for its ability to produce the min / max value in a list
 * of values very efficiently.
 */
export class Heap {
  heap: number[];
  inCorrectOrder: Function;

  constructor(type: HeapType) {
    this.heap = [];

    if (type === HeapType.Min) {
      this.inCorrectOrder = function (parent: number, child: number): boolean {
        return parent <= child;
      };
    } else {
      this.inCorrectOrder = function (parent: number, child: number): boolean {
        return parent >= child;
      };
    }
  }

  /**
   * Adds an item to the heap.
   *
   * @param item - The item to be added to the heap.
   * @space O(1)
   * @time O(log n)
   */
  push(item: number): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  /**
   * Returns the root item in the heap without removing it.
   *
   * @returns The root item in the heap, or null if the heap is empty.
   * @space O(1)
   * @time O(1)
   */
  peek(): number | null {
    if (!this.heap.length) {
      return null;
    }

    return this.heap[0];
  }

  /**
   * Returns and removes the root item in the heap.
   *
   * @returns The root item in the heap, or null if the heap is empty.
   * @space O(1)
   * @time O(log n)
   */
  poll(): number | null {
    if (!this.heap.length) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);

    return root;
  }

  private siftUp(i: number): void {
    let currIdx = i;

    while (
      this.hasParent(currIdx) &&
      !this.inCorrectOrder(
        this.heap[this.getParentIdx(currIdx)],
        this.heap[currIdx]
      )
    ) {
      // if not in correct order, swap
      this.swap(currIdx, this.getParentIdx(currIdx));

      // then, make sure parent is in the right order
      currIdx = this.getParentIdx(currIdx);
    }
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private siftDown(i: number): void {
    let currIdx = i;
    let nextIdx;

    while (this.hasLeftChild(currIdx)) {
      if (
        this.hasRightChild(currIdx) &&
        this.inCorrectOrder(
          this.heap[this.getRightChildIdx(currIdx)],
          this.heap[this.getLeftChildIdx(currIdx)]
        )
      ) {
        nextIdx = this.getRightChildIdx(currIdx);
      } else {
        nextIdx = this.getLeftChildIdx(currIdx);
      }

      if (this.inCorrectOrder(this.heap[currIdx], this.heap[nextIdx])) {
        break;
      }

      this.swap(currIdx, nextIdx);
      currIdx = nextIdx;
    }
  }

  private getLeftChildIdx(i: number): number {
    return 2 * i + 1;
  }

  private hasLeftChild(i: number): boolean {
    return this.getLeftChildIdx(i) < this.heap.length;
  }

  private getRightChildIdx(i: number): number {
    return 2 * i + 2;
  }

  private hasRightChild(i: number): boolean {
    return this.getRightChildIdx(i) < this.heap.length;
  }

  private getParentIdx(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private hasParent(currIdx: number): boolean {
    return this.getParentIdx(currIdx) >= 0;
  }
}
