export class LRUCache {
  data: Map<number, DoublyLinkedListNode>;
  capacity: number;
  head: DoublyLinkedListNode;
  tail: DoublyLinkedListNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.data = new Map();
    this.head = new DoublyLinkedListNode(-1, -1);
    this.tail = new DoublyLinkedListNode(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const existingNode: DoublyLinkedListNode | undefined = this.data.get(key);

    if (existingNode) {
      this.removeNode(existingNode);
      this.insertMRUNode(existingNode);
      return existingNode.val;
    }

    return -1;
  }

  put(key: number, value: number): void {
    const existingNode: DoublyLinkedListNode | undefined = this.data.get(key);

    if (existingNode) {
      this.removeNode(existingNode);
    }

    const newNode: DoublyLinkedListNode = new DoublyLinkedListNode(key, value);
    this.insertMRUNode(newNode);
    this.data.set(key, newNode);

    const isOverCapacity = this.data.size > this.capacity;

    if (isOverCapacity) {
      const lruNode: DoublyLinkedListNode | undefined = this.head.next;

      if (lruNode) {
        this.removeNode(lruNode);
        this.data.delete(lruNode.key);
      }
    }
  }

  removeNode(node: DoublyLinkedListNode): void {
    const prevNode = node!.prev;
    const nextNode = node!.next;

    [prevNode!.next, nextNode!.prev] = [nextNode, prevNode];
  }

  insertMRUNode(node: DoublyLinkedListNode): void {
    const prevMRUNode = this.tail.prev;
    const tailNode = this.tail;

    prevMRUNode!.next = node;
    tailNode.prev = node;

    node.next = tailNode;
    node.prev = prevMRUNode;
  }
}

export class DoublyLinkedListNode {
  key: number;
  val: number;
  next: DoublyLinkedListNode | undefined;
  prev: DoublyLinkedListNode | undefined;

  constructor(
    key: number,
    val: number,
    next?: DoublyLinkedListNode,
    prev?: DoublyLinkedListNode
  ) {
    this.key = key;
    this.val = val;
    this.next = next;
    this.prev = prev;
  }
}
