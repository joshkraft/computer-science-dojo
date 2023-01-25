import {Node, Queue} from './queue';

describe('Node', () => {
  describe('constructor()', () => {
    test('should create a new Node that has a value', () => {
      const node: Node = new Node(0);

      expect(node.val).toBe(0);
      expect(node.next).toBeNull();
    });
  });
});

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue();
  });

  describe('constructor()', () => {
    test('should create a queue that has a head, tail, and size', () => {
      expect(queue.head).toBeNull();
      expect(queue.tail).toBeNull();
      expect(queue.size).toBe(0);
    });
  });

  describe('enqueue()', () => {
    test('should add a node to the end of the queue and update size', () => {
      queue.enqueue(0);

      expect(queue.head?.val).toBe(0);
      expect(queue.tail?.val).toBe(0);
      expect(queue.size).toBe(1);

      queue.enqueue(1);

      expect(queue.head?.val).toBe(0);
      expect(queue.tail?.val).toBe(1);
      expect(queue.size).toBe(2);
    });
  });

  describe('dequeue()', () => {
    test('should remove node at the front of the queue, update size, and return its value', () => {
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
      expect(queue.head).toBeNull();
      expect(queue.tail).toBeNull();
      expect(queue.size).toBe(0);
    });

    test('should return null if the queue is empty', () => {
      expect(queue.dequeue()).toBeNull();
    });
  });

  describe('peek()', () => {
    test('should return the value of the node at the front of the queue', () => {
      queue.enqueue(0);
      expect(queue.peek()).toBe(0);
      expect(queue.head!.val).toBe(0);
      expect(queue.tail!.val).toBe(0);
      expect(queue.size).toBe(1);

      queue.enqueue(1);
      expect(queue.peek()).toBe(0);
      expect(queue.head!.val).toBe(0);
      expect(queue.tail!.val).toBe(1);
      expect(queue.size).toBe(2);
    });

    test('should return null if the queue is empty', () => {
      expect(queue.peek()).toBeNull();
    });
  });
});
