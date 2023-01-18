import {Node, Queue} from './queue';

describe('Node', () => {
  test('should create a new Node that stores a number value', () => {
    const node: Node = new Node(0);

    expect(node.val).toBe(0);
    expect(node.next).toBe(null);
  });
});

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue();
  });

  test('should create a queue with head, tail, and size properties', () => {
    expect(queue.head).toBeNull();
    expect(queue.tail).toBeNull();
    expect(queue.size).toBe(0);
  });

  test('enqueue() should add a node to the end of the queue and update size', () => {
    queue.enqueue(0);

    expect(queue.head?.val).toBe(0);
    expect(queue.tail?.val).toBe(0);
    expect(queue.size).toBe(1);

    queue.enqueue(1);

    expect(queue.head?.val).toBe(0);
    expect(queue.tail?.val).toBe(1);
    expect(queue.size).toBe(2);
  });

  test('dequeue() should remove node at the front of the queue, update size, and return its value', () => {
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.dequeue()).toBe(0);
    expect(queue.head!.val).toBe(1);
    expect(queue.tail!.val).toBe(2);
    expect(queue.size).toBe(2);
    expect(queue.dequeue()).toBe(1);
    expect(queue.head!.val).toBe(2);
    expect(queue.tail!.val).toBe(2);
    expect(queue.size).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.head).toBe(null);
    expect(queue.tail).toBe(null);
    expect(queue.size).toBe(0);
  });

  test('dequeue() should return null if the queue is empty', () => {
    expect(queue.dequeue()).toBe(null);
  });

  test('peek() should return the value of the node at the front of the queue', () => {
    queue.enqueue(0);

    expect(queue.peek()).toBe(0);
    expect(queue.head!.val).toBe(0);
    expect(queue.tail!.val).toBe(0);
    expect(queue.size).toBe(1);
  });

  test('peek() should return null if the queue is empty', () => {
    expect(queue.peek()).toBe(null);
  });
});
