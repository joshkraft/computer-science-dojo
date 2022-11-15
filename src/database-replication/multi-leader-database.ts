import {Database} from './database';
import {DatabaseEntry} from './database-entry';
import {DatabaseReplica} from './database-replica';

export class MultiLeaderDatabase extends Database {
  leaders: DatabaseReplica[];
  followers: DatabaseReplica[];

  constructor(numReplicas = 2, avgNetworkDelay = 0.1, avgPacketLoss = 0.1) {
    super(numReplicas, avgNetworkDelay, avgPacketLoss);
    const numLeaders = Math.floor(numReplicas / 2);
    this.leaders = this.replicas.slice(0, numLeaders);
    this.followers = this.replicas.slice(numLeaders);
  }

  async write(key: any, value: any): Promise<boolean> {
    await Promise.any([...this.leaders.map(l => l.write(key, value))]);

    this.followers.forEach(f => f.write(key, value));

    return true;
  }

  async read(key: any): Promise<DatabaseEntry | undefined> {
    return await Promise.any([...this.replicas.map(r => r.read(key))]);
  }
}
