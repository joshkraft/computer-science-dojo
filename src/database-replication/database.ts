import {NetworkConnection} from '../utilities/network-connection';
import {DatabaseReplica} from './database-replica';
import {DatabaseEntry} from './database-entry';

export abstract class Database {
  replicas: DatabaseReplica[];

  constructor(
    numReplicas: number,
    avgNetworkDelay: number,
    avgPacketLoss: number
  ) {
    if (numReplicas < 2) {
      throw new Error('Number of replicas must be >= 2.');
    }

    this.replicas = [];

    for (let i = 0; i < numReplicas; i++) {
      this.replicas.push(
        new DatabaseReplica(
          new NetworkConnection(avgNetworkDelay, avgPacketLoss)
        )
      );
    }
  }

  abstract write(key: any, value: any): Promise<boolean>;
  abstract read(key: any): Promise<DatabaseEntry | undefined>;

  allNodesAreConsistent(): boolean {
    const expectedData: string = this.replicas[0].getStringifiedNodeData();

    for (const replica of this.replicas) {
      if (replica.getStringifiedNodeData() !== expectedData) {
        return false;
      }
    }

    return true;
  }
}
