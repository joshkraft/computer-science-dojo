import {MultiLeaderDatabase} from './multi-leader-database';
import {sleep} from '../utilities/time-utilities';

describe('Multi Leader Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new MultiLeaderDatabase(5);

    await db.write(1, 'foo');
    while (!db.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    const result = await db.read(1);
    expect(result).toBeDefined();
    expect(result!.value).toEqual('foo');
  });

  test('should send write requests to any leader', async () => {
    const db = new MultiLeaderDatabase();
    expect(
      db.leaders.map(l => l.getNumberOfEntries()).filter(entries => entries > 0)
        .length
    ).toEqual(0);

    await db.write(1, 'foo');

    expect(
      db.leaders.map(l => l.getNumberOfEntries()).filter(entries => entries > 0)
        .length
    ).toEqual(1);
  });

  test('should be able to handle read requests when all leaders are down', async () => {
    const db = new MultiLeaderDatabase();

    await db.write(1, 'foo');
    while (!db.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    const leadersToRemove = db.leaders.length;
    db.replicas.splice(0, leadersToRemove);
    db.leaders.splice(0, leadersToRemove);

    const result = await db.read(1);
    expect(result!.value).toEqual('foo');
  });

  test('should be able to handle write requests as long as any leader remains up', async () => {
    const db = new MultiLeaderDatabase(10);

    const leadersToRemove = db.leaders.length - 1;
    db.replicas.splice(0, leadersToRemove);
    db.leaders.splice(0, leadersToRemove);

    await db.write(1, 'foo');
    while (!db.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    const result = await db.read(1);
    expect(result!.value).toEqual('foo');
  });
});
