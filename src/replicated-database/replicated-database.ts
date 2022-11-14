import {NetworkConnection} from '../utilities/network-connection';

export abstract class Database {
  replicas: DatabaseReplica[];

  constructor(numReplicas = 2, avgNetworkDelay = 1, avgPacketLoss = 0.1) {
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
  abstract nodesAreConsistent(): boolean;
}

export class SingleLeaderDatabase extends Database {
  leader: DatabaseReplica;
  followers: DatabaseReplica[];

  constructor(numReplicas = 2, avgNetworkDelay = 1, avgPacketLoss = 0.1) {
    super(numReplicas, avgNetworkDelay, avgPacketLoss);
    this.leader = this.replicas.slice(0, 1)[0];
    this.followers = this.replicas.slice(1);
  }

  async write(key: any, value: any): Promise<boolean> {
    await this.leader.write(key, value);

    this.followers.forEach(f => f.write(key, value));

    return true;
  }

  async read(key: any): Promise<DatabaseEntry | undefined> {
    return await Promise.any([...this.replicas.map(r => r.read(key))]);
  }

  nodesAreConsistent(): boolean {
    const expected: string = this.leader.getStringifiedNodeData();

    return this.followers.every(f => f.getStringifiedNodeData() === expected);
  }
}

class DatabaseReplica {
  data: Map<any, DatabaseEntry>;
  connection: NetworkConnection;

  constructor(connection: NetworkConnection) {
    this.data = new Map();
    this.connection = connection;
  }

  async read(key: any): Promise<DatabaseEntry | undefined> {
    await this.connection.delay();

    return this.data.get(key);
  }

  async write(key: any, value: any): Promise<boolean> {
    await this.connection.delay();

    const existingEntry = this.data.get(key);

    if (!existingEntry) {
      this.data.set(key, new DatabaseEntry(value));
    } else {
      existingEntry.update(value);
    }

    return true;
  }

  getStringifiedNodeData(): string {
    return JSON.stringify(Array.from(this.data.entries()));
  }

  getNumberOfEntries(): number {
    return this.data.size;
  }
}

class DatabaseEntry {
  value: number;
  version: number;

  constructor(value: number) {
    this.value = value;
    this.version = 0;
  }

  update(val: number) {
    this.value = val;
    this.version++;
  }
}
