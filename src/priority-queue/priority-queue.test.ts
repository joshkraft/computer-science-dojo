import {PriorityQueue} from './priority-queue';

describe('Priority Queue', () => {
  let pq: PriorityQueue;

  beforeEach(() => {
    pq = new PriorityQueue();

    pq.insertWithPriority('kinda important', 5);
    pq.insertWithPriority('very important', 1);
    pq.insertWithPriority('not important', 10);
  });

  test('items are stored in the right order based on their priority', () => {
    expect(pq.data.map(entry => entry.element)).toEqual([
      'very important',
      'kinda important',
      'not important',
    ]);
  });

  test('items are returned in the right order based on their priority', () => {
    expect(pq.pullHighestPriorityElement()).toEqual('very important');
    expect(pq.pullHighestPriorityElement()).toEqual('kinda important');
    expect(pq.pullHighestPriorityElement()).toEqual('not important');
  });
});
