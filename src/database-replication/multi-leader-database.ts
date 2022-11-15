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

  /**
   * Writes a key value pair by writing to all leader nodes, but only waits for
   * confirmation from at least one leader node before considering the write a
   * success. All followers receive the write asynchronously.
   */
  async write(key: any, value: any): Promise<boolean> {
    await Promise.any([...this.leaders.map(l => l.write(key, value))]);

    for (const follower of this.followers) {
      follower.write(key, value);
    }

    return true;
  }

  /**
   * Reads the value for the provided key by sending the request to all nodes
   * (leaders and followers) and returning the first value returned by any node.
   */
  async read(key: any): Promise<DatabaseEntry | undefined> {
    return await Promise.any([...this.replicas.map(r => r.read(key))]);
  }
}
