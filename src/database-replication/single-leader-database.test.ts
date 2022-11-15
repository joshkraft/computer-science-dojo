import {sleep} from '../utilities/time-utilities';
import {SingleLeaderDatabase} from './single-leader-database';

describe('Single Leader Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new SingleLeaderDatabase(5);

    await db.write(1, 'foo');
    while (!db.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    const result = await db.read(1);
    expect(result).toBeDefined();
    expect(result!.value).toEqual('foo');
  });

  test('should send write requests to leader', async () => {
    const db = new SingleLeaderDatabase();

    expect(db.leader.getNumberOfEntries()).toEqual(0);

    await db.write(1, 'foo');

    expect(db.leader.getNumberOfEntries()).toEqual(1);
  });

  test('should be able to handle read requests when leader is down', async () => {
    const db = new SingleLeaderDatabase();

    await db.write(1, 'foo');
    while (!db.allNodesAreConsistent()) {
      await sleep(0.1);
    }
    // @ts-ignore
    db.leader = null;

    const result = await db.read(1);
    expect(result!.value).toEqual('foo');
  });

  test('should be able to handle read requests faster by adding followers', async () => {
    const fewFollowersDB = new SingleLeaderDatabase(2);
    const manyFollowersDB = new SingleLeaderDatabase(20);

    await fewFollowersDB.write(1, 'foo');
    while (!fewFollowersDB.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    await manyFollowersDB.write(1, 'foo');
    while (!manyFollowersDB.allNodesAreConsistent()) {
      await sleep(0.1);
    }

    let start = process.hrtime.bigint();
    await fewFollowersDB.read(1);
    let stop = process.hrtime.bigint();
    const fewFollowersReadTime = stop - start;

    start = process.hrtime.bigint();
    await manyFollowersDB.read(1);
    stop = process.hrtime.bigint();
    const manyFollowersReadTime = stop - start;

    expect(manyFollowersReadTime).toBeLessThan(fewFollowersReadTime);
  });
});
