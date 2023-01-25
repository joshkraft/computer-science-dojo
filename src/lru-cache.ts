/**
 * Node is a general purpose doubly linked list node, which can be used to
 * represent items in a cache.
 */
export class Node {
  key: string;
  val: string;
  next: Node | null;
  prev: Node | null;

  constructor(key: string, val: string) {
    this.key = key;
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

/**
 * LRU Cache is an implementation of a cache that stores a fixed number of items
 * in memory and evicts the least recently used items when the limit is reached.
 *
 * The cache should be able to both get() and put() an item in O(1) time.
 */
export class LRUCache {
  size: number;
  cache: Map<string, Node>;
  head: Node;
  tail: Node;

  constructor(size: number) {
    this.size = size;
    this.cache = new Map<string, Node>();

    this.head = new Node('dummyHead', 'dummyHead');
    this.tail = new Node('dummyTail', 'dummyTail');

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Adds an item to the cache, or updates the value of the item if it already
   * exists in the cache.
   *
   * @param key The key of the item to be added to the cache.
   * @param val The value of the item to added to the cache.
   * @space O(1)
   * @time O(1)
   */
  put(key: string, val: string): void {
    const existingNode: Node | undefined = this.cache.get(key);

    if (existingNode) {
      existingNode.val = val;
      this.moveToHead(existingNode);
      return;
    }

    const newNode: Node = new Node(key, val);
    this.cache.set(key, newNode);
    this.addNode(newNode);

    if (this.cache.size > this.size) {
      this.removeTail();
    }
  }

  /**
   * Retrieves an item from the cache. If the item exists in the cache, it
   * becomes the 'most recently used' item.
   *
   * @param key The key of the item to retrieve.
   * @returns The value of the item, or null if the item is not in the cache.
   * @space O(1)
   * @time O(1)
   */
  get(key: string): string | null {
    const existingNode: Node | undefined = this.cache.get(key);

    if (!existingNode) {
      return null;
    }

    this.moveToHead(existingNode);

    return existingNode.val;
  }

  private moveToHead(node: Node): void {
    this.removeNode(node);
    this.addNode(node);
  }

  private removeNode(node: Node): void {
    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  private addNode(node: Node): void {
    node.prev = this.head;
    node.next = this.head.next;

    if (this.head.next) {
      this.head.next.prev = node;
    }

    this.head.next = node;
  }

  private removeTail(): void {
    const tailNode = this.tail.prev;

    if (tailNode) {
      this.removeNode(tailNode);
      this.cache.delete(tailNode.key);
    }
  }
}
