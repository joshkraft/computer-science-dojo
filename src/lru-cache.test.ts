import {LRUCache, Node} from './lru-cache';

describe('Node', () => {
  describe('constructor()', () => {
    test('should create a new Node that has a key, value, next pointer, and prev pointer', () => {
      const node: Node = new Node('foo', 'Foo');

      expect(node.key).toBe('foo');
      expect(node.val).toBe('Foo');
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });
  });
});

describe('LRU Cache', () => {
  let cache: LRUCache;

  beforeEach(() => {
    cache = new LRUCache(5);
  });

  describe('constructor()', () => {
    test('should create a LRUCache that has a size, cache, head pointer, and tail pointer', () => {
      expect(cache.size).toBe(5);
      expect(cache.cache).toEqual(new Map<string, Node>());
      expect(cache.head).toBeDefined();
      expect(cache.tail).toBeDefined();
    });
  });

  describe('put()', () => {
    test('should add items to the cache', () => {
      cache.put('a', 'A');
      cache.put('b', 'B');
      cache.put('c', 'C');

      expect(cache.cache.get('a')!.val).toBe('A');
      expect(cache.cache.get('b')!.val).toBe('B');
      expect(cache.cache.get('c')!.val).toBe('C');
    });

    test('should update items value if it already exists in cache', () => {
      cache.put('a', 'A');
      expect(cache.cache.get('a')!.val).toBe('A');

      cache.put('a', 'B');
      expect(cache.cache.get('a')!.val).toBe('B');
    });

    test('should evict least recently used item from cache when size limit is reached', () => {
      cache.put('a', 'A');
      cache.put('b', 'B');
      cache.put('c', 'C');
      cache.put('d', 'D');
      cache.put('e', 'E');

      expect(cache.cache.has('a')).toBe(true);
      expect(cache.cache.size).toBe(5);

      cache.put('f', 'F');

      expect(cache.cache.has('a')).toBe(false);
      expect(cache.cache.size).toBe(5);
    });
  });

  describe('get()', () => {
    test('should return value of item if present in cache', () => {
      cache.put('a', 'A');
      cache.put('b', 'B');

      expect(cache.get('a')).toBe('A');
      expect(cache.get('b')).toBe('B');
    });

    test('should return null if item is not present in cache', () => {
      expect(cache.get('a')).toBeNull();
    });

    test('should move item to front of queue when it is accessed', () => {
      cache.put('a', 'A');
      cache.put('b', 'B');
      cache.put('c', 'C');

      expect(cache.head.next!.key).toBe('c');

      cache.get('a');

      expect(cache.head.next!.key).toBe('a');
    });
  });
});
