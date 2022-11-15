import {
  LeaderlessDatabase,
  MultiLeaderDatabase,
  SingleLeaderDatabase,
} from './replicated-database';
import {sleep} from '../utilities/time-utilities';

describe('Single Leader Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new SingleLeaderDatabase(5);

    await db.write(1, 'foo');
    while (!db.nodesAreConsistent()) {
      await sleep(1);
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
    while (!db.nodesAreConsistent()) {
      await sleep(1);
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
    while (!fewFollowersDB.nodesAreConsistent()) {
      await sleep(1);
    }

    await manyFollowersDB.write(1, 'foo');
    while (!manyFollowersDB.nodesAreConsistent()) {
      await sleep(1);
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

describe('Multi Leader Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new MultiLeaderDatabase(5);

    await db.write(1, 'foo');
    while (!db.nodesAreConsistent()) {
      await sleep(1);
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
    while (!db.nodesAreConsistent()) {
      await sleep(1);
    }

    const leadersToRemove = db.leaders.length;
    // @ts-ignore
    db.replicas.splice(0, leadersToRemove);
    // @ts-ignore
    db.leaders.splice(0, leadersToRemove);

    const result = await db.read(1);
    expect(result!.value).toEqual('foo');
  });

  test('should be able to handle write requests as long as any leader remains up', async () => {
    const db = new MultiLeaderDatabase(10);

    const leadersToRemove = db.leaders.length - 1;
    // @ts-ignore
    db.replicas.splice(0, leadersToRemove);
    // @ts-ignore
    db.leaders.splice(0, leadersToRemove);

    await db.write(1, 'foo');
    while (!db.nodesAreConsistent()) {
      await sleep(1);
    }

    const result = await db.read(1);
    expect(result!.value).toEqual('foo');
  });
});

describe.only('Leaderless Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new LeaderlessDatabase();

    await db.write(1, 'foo');

    const result = await db.read(1);
    console.log(result);
    expect(result).toBeDefined();
    expect(result!.value).toEqual('foo');
  });

  test.only('should be able to find the latest version', async () => {
    const db = new LeaderlessDatabase();

    await db.write(1, 0);

    for (let i = 1; i < 100; i++) {
      await db.write(1, i);

      const res = await db.read(1);

      expect(res).toBeDefined();
      expect(res!.version).toBeDefined();
      expect(res!.version).toEqual(i);
      //   console.log('expected: ', i);
      //   console.log('received: ', res);
    }

    const result = await db.read(1);
    console.log(result);
    expect(result).toBeDefined();
    expect(result!.value).toEqual('foo');
  });
});
