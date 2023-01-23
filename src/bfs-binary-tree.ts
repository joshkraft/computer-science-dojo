/**
 * Node is a general purpose binary tree node.
 */
export class Node {
  val: number;
  left: Node | null;
  right: Node | null;

  constructor(val: number, left?: Node, right?: Node) {
    this.val = val;
    this.left = left || null;
    this.right = right || null;
  }
}

/**
 * Searches a binary tree for a node that matches the provided target, using the
 * breadth first search algorithm.
 *
 * The breadth first search algorithm works by utilizing a queue to visit all
 * nodes at a 'level' in the tree before moving on to the next level.
 * The algorithm continues searching farther down the levels of the tree until
 * the target is found, or all nodes have been visited.
 *
 * @param root The root node of the binary tree.
 * @param target The number to search for in the binary tree.
 * @returns A boolean indicating if the target value exists in the binary tree.
 * @space O(n)
 * @time O(n)
 * - n: number of nodes in the tree
 */
export function bfsBinaryTree(root: Node, target: number): boolean {
  const queue: Node[] = [root];

  while (queue.length) {
    const curr = queue.shift() as Node;

    if (curr.val === target) {
      return true;
    }

    if (curr.left) {
      queue.push(curr.left);
    }

    if (curr.right) {
      queue.push(curr.right);
    }
  }

  return false;
}
