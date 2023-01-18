/**
 * Node is a general purpose singly linked list node, which
 * can be used to represent items in a queue.
 */
export class Node {
  val: number;
  next: Node | null;

  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

/**
 * Queue is an implementation of a queue data structure that uses a singly
 * linked list to store a list of items. This allows for efficient addition and
 * removal of items in a First In First Out (FIFO) manner.
 */
export class Queue {
  head: Node | null;
  tail: Node | null;
  size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /**
   * Creates a new node to represent the provided value, adds it to the end of
   * the queue, and updates the queue's size.
   *
   * @param val The value to be added to the queue.
   * @space O(1)
   * @time O(1)
   */
  enqueue(val: number) {
    const nodeToInsert: Node = new Node(val);

    if (!this.head) {
      this.head = nodeToInsert;
      this.tail = nodeToInsert;
    } else {
      this.tail!.next = nodeToInsert;
      this.tail = this.tail!.next;
    }

    this.size++;
  }

  /**
   * Removes the node at the front of the queue and updates the queue's size.
   *
   * @returns {number | null} The value at the front of the queue, or null if
   * 						  the queue is empty.
   * @space O(1)
   * @time O(1)
   */
  dequeue() {
    if (!this.head) {
      return null;
    }

    const toDelete: Node = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size--;

    return toDelete.val;
  }

  /**
   * Returns the value of the node at the front of the queue without removing it.
   *
   * @returns {number | null} The value at the front of the queue, or null if
   * 						  the queue is empty.
   * @space O(1)
   * @time O(1)
   */
  peek() {
    if (!this.head) {
      return null;
    }

    return this.head.val;
  }
}
