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
 * linked list to store a list of items which can be efficiently added / removed
 * in First In First Out (FIFO) order.
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
    const newNode: Node = new Node(val);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
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

    const removedNode: Node = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size--;

    return removedNode.val;
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
