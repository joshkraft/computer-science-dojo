/**
 * Node is a general purpose singly linked list node.
 */
export class Node {
  val: number;
  next: Node | null;

  constructor(val: number, next?: Node) {
    this.val = val;
    this.next = next || null;
  }
}

/**
 * Searches a singly linked list for cycles, using Floyds cycle detection
 * algorithm.
 *
 * Floyds cycle detection algorithm works by using a slow pointer (tortoise)
 * and a fast pointer (hare) to move through the linked list at different
 * speeds - two nodes at a time and one node at a time, respectively.
 *
 * If there is a cycle in the list, the fast pointer will eventually loop around
 * and catch up to the slow pointer, and end up pointing to the same node. If
 * this occurs, we know there must be a cycle. If the fast pointer reaches the
 * end of the list, we know that there is not a cycle.
 *
 * @param head The head of the list to run cycle detection on.
 * @returns A boolean indicating if a cycle exists in the list.
 * @space O(1)
 * @time O(n)
 */
export function floydsCycleDetection(head: Node): boolean {
  let tortoise: Node | null = head;
  let hare: Node | null = head;

  while (tortoise && hare && hare.next) {
    tortoise = tortoise.next;
    hare = hare.next.next;

    if (tortoise === hare) {
      return true;
    }
  }

  return false;
}
