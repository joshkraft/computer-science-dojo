import {LRUCache} from './lru-cache';

describe('LRU Cache', () => {
  let cache: LRUCache;

  beforeEach(() => {
    cache = new LRUCache(5);
  });

  test('constructor creates an empty cache and head/tail nodes', () => {
    expect(cache.data.size).toBe(0);
    expect(cache.head).toBeDefined();
    expect(cache.tail).toBeDefined();
  });

  test('get(key) should return the value, if the provided key is in the cache', () => {
    cache.put(1, 1);

    expect(cache.get(1)).toBe(1);
  });

  test('get(key) should return -1, if the provided key is not in the cache', () => {
    expect(cache.get(1)).toBe(-1);
  });

  test('get(key) marks the provided key as the most recently used', () => {
    cache.put(1, 1);
    cache.put(2, 2);

    cache.get(1);

    expect(cache.tail.prev?.val).toBe(1);
  });

  test('put(key, value) inserts the key, value pair into the cache', () => {
    cache.put(1, 1);

    expect(cache.data.has(1)).toBe(true);
  });

  test('put(key, value) overwrites the value if the key already exists in the cache', () => {
    cache.put(1, 1);

    cache.put(1, 2);

    expect(cache.data.get(1)?.val).toBe(2);
  });

  test('put(key, value) marks the provided key as the most recently used', () => {
    cache.put(1, 1);
    cache.put(2, 2);

    expect(cache.tail.prev?.val).toBe(2);
  });

  test('when the capacity of the cache is reached, the least recently used key, value pair is removed', () => {
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(3, 3);
    cache.put(4, 4);
    cache.put(5, 5);
    cache.put(6, 6);

    expect(cache.data.size).toBe(5);
    expect(cache.head.next?.val).toBe(2);
    expect(cache.tail.prev?.val).toBe(6);
  });
});
