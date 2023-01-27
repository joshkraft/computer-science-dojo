import {floydsCycleDetection, Node} from './floyds-cycle-detection';

describe('Node', () => {
  describe('constructor()', () => {
    test('should create a new Node that has a value and next pointer', () => {
      const node: Node = new Node(1);

      expect(node.val).toBe(1);
      expect(node.next).toBeNull();
    });
  });
});

describe('Floyds Cycle Detection', () => {
  test('should return false if no cycle exists', () => {
    expect(floydsCycleDetection(buildList(5, false))).toBe(false);
  });

  test('should return true if a cycle exists', () => {
    expect(floydsCycleDetection(buildList(5, true))).toBe(true);
  });

  test('should handle lists of size 1', () => {
    expect(floydsCycleDetection(buildList(1, false))).toBe(false);
    expect(floydsCycleDetection(buildList(1, true))).toBe(true);
  });
});

function buildList(size = 5, hasCycle = false): Node {
  const head = new Node(0);

  let curr = head;
  for (let i = 0; i < size; i++) {
    curr.next = new Node(i);
    curr = curr.next;
  }

  if (hasCycle) {
    curr.next = head;
  }

  return head;
}
