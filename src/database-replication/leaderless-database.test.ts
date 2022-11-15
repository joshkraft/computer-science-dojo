import {LeaderlessDatabase} from './leaderless-database';

describe('Leaderless Database', () => {
  test('should be able to write to and read from database', async () => {
    const db = new LeaderlessDatabase();

    await db.write(1, 'foo');

    const result = await db.read(1);

    expect(result).toBeDefined();
    expect(result!.value).toEqual('foo');
    expect(result!.version).toEqual(0);
  });

  test('should be able to find the latest version', async () => {
    const db = new LeaderlessDatabase();

    for (let i = 0; i < 5; i++) {
      await db.write(1, i);

      const res = await db.read(1);

      expect(res!.value).toEqual(i);
      expect(res!.version).toEqual(i);
    }
  });

  test('should be able to tolerate loss of up to n / 2 nodes and remain functional', async () => {
    const r = 5;
    const w = 5;
    const numReplicas = 9;
    const tolerableNodeLoss = Math.floor(numReplicas / 2);
    const db = new LeaderlessDatabase(r, w, numReplicas);

    for (let i = 0; i < tolerableNodeLoss; i++) {
      for (let j = 0; j < 5; j++) {
        await db.write(1, j);
        const res = await db.read(1);
        expect(res!.value).toEqual(j);
      }

      db.replicas.splice(0, 1);
    }
  });
});
