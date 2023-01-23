import {Node, bfsBinaryTree} from './bfs-binary-tree';

describe('Breadth First Search Binary Tree', () => {
  let root: Node;

  beforeAll(() => {
    root = new Node(
      1,
      new Node(2, new Node(4), new Node(5)),
      new Node(3, new Node(6), new Node(7))
    );
  });

  test('should return true if tree contains target', () => {
    for (let i = 1; i <= 7; i++) {
      expect(bfsBinaryTree(root, i)).toBe(true);
    }
  });

  test('should return false if tree does not contain target', () => {
    expect(bfsBinaryTree(root, 0)).toBe(false);
  });
});
