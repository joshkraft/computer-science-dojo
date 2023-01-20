/**
 * Node is a general purpose singly linked list node, which can be used to
 * represent items in a priority queue.
 */
export class Node {
  val: number;
  next: Node | null;
  priority: number;

  constructor(val: number, priority: number) {
    this.val = val;
    this.priority = priority;
    this.next = null;
  }
}

/**
 * Priority Queue is an implementation of a priority queue data structure that
 * uses a singly linked list to store a list of items ordered by priority. This
 * allows for efficient access to the element with the highest priority.
 *
 * Note: priority queues are often implemented with a heap instead of a linked
 * list, which allows for faster enqueueing at the cost of slower dequeueing.
 */
export class PriorityQueue {
  head: Node | null;
  size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * Creates a new node to represent the provided value and it's given priority,
   * adds it to the appropriate place in the priority queue, and updates the
   * priority queue's size.
   *
   * If two nodes have the same priority, the priority queue will defer to FIFO
   * ordering, where the node which was inserted first will be considered higher
   * priority.
   * maintain a higher position in the priority queue.
   *
   * @param val The value of the item to be added to the queue.
   * @param priority The priority of the item to be added to the queue.
   * @space O(1)
   * @time O(n)
   */
  enqueue(val: number, priority: number) {
    const newNode: Node = new Node(val, priority);

    if (!this.head) {
      this.head = newNode;
    } else if (newNode.priority > this.head.priority) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let currNode = this.head;

      while (currNode.next && newNode.priority <= currNode.next.priority) {
        currNode = currNode.next;
      }

      newNode.next = currNode.next;
      currNode.next = newNode;
    }

    this.size++;
  }

  /**
   * Removes the value of the node with the highest priority (stored at the
   * front of the priority queue) and updates the queue's size.
   *
   * @returns {number | null} The value of the item with the highest priority,
   * 						  or null if the queue is empty.
   * @space O(1)
   * @time O(1)
   */
  dequeue() {
    if (!this.head) {
      return null;
    }

    const removedNode: Node = this.head;
    this.head = this.head.next;
    this.size--;

    return removedNode.val;
  }

  /**
   * Returns the value of the node with the highest priority in the priority
   * queue without removing it.
   *
   * @returns {number | null} The value of the item with the highest priority,
   * 						  or null if the queue is empty.
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
