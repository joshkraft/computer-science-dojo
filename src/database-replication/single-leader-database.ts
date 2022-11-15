import {Database} from './database';
import {DatabaseEntry} from './database-entry';
import {DatabaseReplica} from './database-replica';

export class SingleLeaderDatabase extends Database {
  leader: DatabaseReplica;
  followers: DatabaseReplica[];

  constructor(numReplicas = 2, avgNetworkDelay = 0.1, avgPacketLoss = 0.1) {
    super(numReplicas, avgNetworkDelay, avgPacketLoss);
    this.leader = this.replicas.slice(0, 1)[0];
    this.followers = this.replicas.slice(1);
  }

  /**
   * Writes a key value pair by writing to the leader node synchronously and
   * writing to all follower nodes asynchronously.
   */
  async write(key: any, value: any): Promise<boolean> {
    await this.leader.write(key, value);

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
