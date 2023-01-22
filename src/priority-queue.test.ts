import {Node, PriorityQueue} from './priority-queue';

describe('Node', () => {
  describe('constructor()', () => {
    test('should create a new Node that has a value, priority, and next pointer', () => {
      const node: Node = new Node(0, 0);

      expect(node.val).toEqual(0);
      expect(node.priority).toEqual(0);
      expect(node.next).toEqual(null);
    });
  });
});

describe('Priority Queue', () => {
  let pq: PriorityQueue;

  beforeEach(() => {
    pq = new PriorityQueue();
  });

  describe('constructor()', () => {
    test('should create a priority queue that has a head and size', () => {
      expect(pq.head).toBeNull();
      expect(pq.size).toEqual(0);
    });
  });

  describe('enqueue()', () => {
    test('should add a node to the appropriate location in the priority queue and update size', () => {
      pq.enqueue(1, 1);
      expect(pq.head?.val).toEqual(1);
      expect(pq.size).toEqual(1);

      pq.enqueue(2, 2);
      expect(pq.head?.val).toEqual(2);
      expect(pq.size).toEqual(2);

      pq.enqueue(3, 0);
      expect(pq.head?.val).toEqual(2);
      expect(pq.size).toEqual(3);
    });

    test('should order nodes with equal priority based on insertion order', () => {
      pq.enqueue(1, 1);
      expect(pq.head?.val).toEqual(1);
      expect(pq.size).toEqual(1);

      pq.enqueue(2, 1);
      expect(pq.head?.val).toEqual(1);
      expect(pq.head?.next?.val).toEqual(2);
      expect(pq.size).toEqual(2);
    });

    test('should treat negative priority values as lower priority than 0', () => {
      pq.enqueue(0, 0);
      expect(pq.head?.val).toEqual(0);
      expect(pq.size).toEqual(1);

      pq.enqueue(1, -1);
      expect(pq.head?.val).toEqual(0);
      expect(pq.size).toEqual(2);

      pq.enqueue(2, -2);
      expect(pq.head?.val).toEqual(0);
      expect(pq.head?.next?.val).toEqual(1);
      expect(pq.size).toEqual(3);
    });
  });

  describe('dequeue()', () => {
    test('should remove node with highest priority, update size, and return its value', () => {
      pq.enqueue(1, 1);
      pq.enqueue(2, 2);
      pq.enqueue(3, 3);

      expect(pq.dequeue()).toEqual(3);
      expect(pq.size).toEqual(2);

      expect(pq.dequeue()).toEqual(2);
      expect(pq.size).toEqual(1);

      expect(pq.dequeue()).toEqual(1);
      expect(pq.size).toEqual(0);
    });

    test('should return null if the priority queue is empty', () => {
      expect(pq.dequeue()).toEqual(null);
    });

    test('should set head to null if last node in the priority queue is removed', () => {
      pq.enqueue(0, 0);
      pq.dequeue();

      expect(pq.head).toBeNull();
    });
  });

  describe('peek()', () => {
    test('should return the value of the node with the highest priority', () => {
      pq.enqueue(0, 0);
      expect(pq.peek()).toEqual(0);
      expect(pq.size).toEqual(1);

      pq.enqueue(1, 1);
      expect(pq.peek()).toEqual(1);
      expect(pq.size).toEqual(2);
    });

    test('should return null if the priority queue is empty', () => {
      expect(pq.peek()).toEqual(null);
    });
  });
});
