import {Node, Queue} from './queue';

describe('Node', () => {
  describe('constructor()', () => {
    test('should create a new Node that stores a value', () => {
      const node: Node = new Node(0);

      expect(node.val).toEqual(0);
      expect(node.next).toEqual(null);
    });
  });
});

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue();
  });

  describe('constructor()', () => {
    test('should create a queue with head, tail, and size properties', () => {
      expect(queue.head).toBeNull();
      expect(queue.tail).toBeNull();
      expect(queue.size).toEqual(0);
    });
  });

  describe('enqueue()', () => {
    test('should add a node to the end of the queue and update size', () => {
      queue.enqueue(0);

      expect(queue.head?.val).toEqual(0);
      expect(queue.tail?.val).toEqual(0);
      expect(queue.size).toEqual(1);

      queue.enqueue(1);

      expect(queue.head?.val).toEqual(0);
      expect(queue.tail?.val).toEqual(1);
      expect(queue.size).toEqual(2);
    });
  });

  describe('dequeue()', () => {
    test('should remove node at the front of the queue, update size, and return its value', () => {
      queue.enqueue(0);
      queue.enqueue(1);
      queue.enqueue(2);

      expect(queue.dequeue()).toEqual(0);
      expect(queue.head!.val).toEqual(1);
      expect(queue.tail!.val).toEqual(2);
      expect(queue.size).toEqual(2);

      expect(queue.dequeue()).toEqual(1);
      expect(queue.head!.val).toEqual(2);
      expect(queue.tail!.val).toEqual(2);
      expect(queue.size).toEqual(1);

      expect(queue.dequeue()).toEqual(2);
      expect(queue.head).toEqual(null);
      expect(queue.tail).toEqual(null);
      expect(queue.size).toEqual(0);
    });

    test('should return null if the queue is empty', () => {
      expect(queue.dequeue()).toEqual(null);
    });
  });

  describe('peek()', () => {
    test('should return the value of the node at the front of the queue', () => {
      queue.enqueue(0);
      expect(queue.peek()).toEqual(0);
      expect(queue.head!.val).toEqual(0);
      expect(queue.tail!.val).toEqual(0);
      expect(queue.size).toEqual(1);

      queue.enqueue(1);
      expect(queue.peek()).toEqual(0);
      expect(queue.head!.val).toEqual(0);
      expect(queue.tail!.val).toEqual(1);
      expect(queue.size).toEqual(2);
    });

    test('should return null if the queue is empty', () => {
      expect(queue.peek()).toEqual(null);
    });
  });
});
