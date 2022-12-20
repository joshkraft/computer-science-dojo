export class BinaryMinHeap {
  heap: number[];

  constructor() {
    this.heap = [];
  }

  push(val: number): void {
    this.heap.push(val);

    this.heapifyUp();
  }

  peek(): number | null {
    if (!this.heap.length) {
      return null;
    }

    return this.heap[0];
  }

  pop(): number | null {
    if (!this.heap.length) {
      return null;
    }

    if (this.heap.length === 1) {
      const val = this.heap.pop();
      return val ? val : null; // this is needed because pop can return undefined
    }

    const rootVal = this.heap[0];
    const mostRecentVal = this.heap.pop();

    if (!mostRecentVal) {
      return null;
    }

    this.heap[0] = mostRecentVal;

    this.heapifyDown();

    return rootVal;
  }

  heapifyDown(): void {
    let currIdx = 0;
    let nextIdx = null;

    while (this.hasLeftChild(currIdx) || this.hasRightChild(currIdx)) {
      if (
        this.hasRightChild(currIdx) &&
        this.nodesAreCorrectlyOrdered(
          this.getRightChildIdx(currIdx),
          this.getLeftChildIdx(currIdx)
        )
      ) {
        nextIdx = this.getRightChildIdx(currIdx);
      } else {
        nextIdx = this.getLeftChildIdx(currIdx);
      }

      if (this.nodesAreCorrectlyOrdered(currIdx, nextIdx)) {
        break;
      }

      this.swapNodes(currIdx, nextIdx);

      currIdx = nextIdx;
    }
  }

  heapifyUp(): void {
    let currIdx = this.heap.length - 1;

    while (
      this.hasParent(currIdx) &&
      !this.nodesAreCorrectlyOrdered(this.getParentIdx(currIdx), currIdx)
    ) {
      this.swapNodes(currIdx, this.getParentIdx(currIdx));
      currIdx = this.getParentIdx(currIdx);
    }
  }

  size(): number {
    return this.heap.length - 1;
  }

  getLeftChildIdx(parentIdx: number): number {
    return parentIdx * 2;
  }

  hasLeftChild(parentIdx: number): boolean {
    return this.getLeftChildIdx(parentIdx) < this.heap.length;
  }

  getLeftChild(parentIdx: number): number {
    return this.heap[this.getLeftChildIdx(parentIdx)];
  }

  getRightChildIdx(parentIdx: number): number {
    return parentIdx * 2 + 1;
  }

  hasRightChild(parentIdx: number): boolean {
    return this.getRightChildIdx(parentIdx) < this.heap.length;
  }

  getRightChild(parentIdx: number): number {
    return this.heap[this.getRightChildIdx(parentIdx)];
  }

  getParentIdx(childIdx: number): number {
    return Math.floor(childIdx / 2);
  }

  hasParent(childIdx: number): boolean {
    return this.getParentIdx(childIdx) < this.heap.length;
  }

  getParent(childIdx: number): number {
    return this.heap[this.getParentIdx(childIdx)];
  }

  nodesAreCorrectlyOrdered(idxOne: number, idxTwo: number): boolean {
    return this.heap[idxOne] <= this.heap[idxTwo];
  }

  swapNodes(idxOne: number, idxTwo: number): void {
    [this.heap[idxOne], this.heap[idxTwo]] = [
      this.heap[idxTwo],
      this.heap[idxOne],
    ];
  }

  print(): void {
    console.log(this.heap);
  }
}
