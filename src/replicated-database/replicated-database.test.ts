import {Database} from './replicated-database';

describe('Replicated Database', () => {
  test('should be able to create a database with replicas', () => {
    const replicas = 5;

    const db = new Database({numReplicas: replicas});

    expect(db.replicas.length).toEqual(replicas);
  });

  test('increasing number of replicas increases the time to reach consensus', async () => {
    const timeWithOneReplica = await new Database({
      numReplicas: 1,
    }).write('foo', 1);

    const timeWithManyReplicas = await new Database({numReplicas: 300}).write(
      'foo',
      1
    );

    expect(timeWithManyReplicas).toBeGreaterThan(timeWithOneReplica);
  });

  test('increasing avgNetworkDelay increases the time to reach consensus', async () => {
    const timeWithoutDelay = await new Database({
      avgNetworkDelay: 0,
    }).write('foo', 1);

    const timeWithDelay = await new Database({avgNetworkDelay: 1}).write(
      'foo',
      1
    );

    expect(timeWithDelay).toBeGreaterThan(timeWithoutDelay);
  });

  test('increasing avgPacketLoss increases the time to reach consensus', async () => {
    const timeWithoutPacketLoss = await new Database({
      avgNetworkDelay: 0.1,
    }).write('foo', 1);

    const timeWithPacketLoss = await new Database({
      avgNetworkDelay: 0.1,
      avgPacketLoss: 0.7,
    }).write('foo', 1);

    expect(timeWithPacketLoss).toBeGreaterThan(timeWithoutPacketLoss);
  });
});
