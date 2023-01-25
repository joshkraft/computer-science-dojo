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
 * depth first search algorithm.
 *
 * The depth first search algorithm works by utilizing a stack (call stack or
 * stack data structure) to visit all nodes in a 'depth first' manner. The
 * algorithm explores as far as possible along each branch of the tree before
 * backtracking and exploring the next branch of the tree. This continues until
 * the target is found, or all nodes have been visited.
 *
 * @param root The root node of the binary tree.
 * @param target The number to search for in the binary tree.
 * @returns A boolean indicating if the target value exists in the binary tree.
 * @space O(h)
 * @time O(n)
 * - h: height of the tree
 * - n: number of nodes in the tree
 */
export function dfsBinaryTree(root: Node, target: number): boolean {
  const stack: Node[] = [root];

  while (stack.length) {
    const curr: Node = stack.pop() as Node;

    if (curr.val === target) {
      return true;
    }

    if (curr.left) {
      stack.push(curr.left);
    }

    if (curr.right) {
      stack.push(curr.right);
    }
  }

  return false;
}
