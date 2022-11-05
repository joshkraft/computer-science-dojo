export class Queue {
  head: QueueNode;
  tail: QueueNode;
  size: number;

  constructor() {
    this.head = new QueueNode(Number.NEGATIVE_INFINITY);
    this.tail = this.head;
    this.size = 0;
  }

  enqueue(val: number): void {
    this.tail.setNext(new QueueNode(val));
    this.tail = this.tail!.next!;
    this.size++;
  }

  dequeue(): number | null {
    if (this.getSize() === 0) {
      return null;
    }

    const toRemove: QueueNode = this.head!.next!;
    this.head.next = toRemove!.next;
    this.size--;

    return toRemove.val;
  }

  peek(): number | null {
    if (this.getSize() === 0) {
      return null;
    }

    return this.head!.next!.val!;
  }

  getSize(): number {
    return this.size;
  }

  print(): void {
    console.log(JSON.stringify(this.head.next));
  }
}

class QueueNode {
  val: number;
  next: QueueNode | null;

  constructor(val: number) {
    this.val = val;
    this.next = null;
  }

  setNext(node: QueueNode) {
    this.next = node;
  }
}
