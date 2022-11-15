import {NetworkConnection} from '../utilities/network-connection';
import {sleep} from '../utilities/time-utilities';

abstract class Database {
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
    const expectedData: string = this.leader.getStringifiedNodeData();

    for (const replica of this.replicas) {
      if (replica.getStringifiedNodeData() !== expectedData) {
        return false;
      }
    }

    return true;
  }
}

export class LeaderlessDatabase extends Database {
  r: number;
  w: number;

  // TODO: consider adding all type annotations to be consistent
  constructor(
    r = 2,
    w = 2,
    numReplicas = 3,
    avgNetworkDelay = 1,
    avgPacketLoss = 0.1
  ) {
    if (r < 0 || r > numReplicas) {
      throw new Error('r value must be >= 0 and <= numReplicas');
    }

    if (w < 0 || w > numReplicas) {
      throw new Error('w value must be >= 0 and <= numReplicas');
    }

    super(numReplicas, avgNetworkDelay, avgPacketLoss);
    this.r = r;
    this.w = w;
  }

  async write(key: any, value: any): Promise<boolean> {
    const responses: boolean[] = [];

    for (const replica of this.replicas) {
      replica.write(key, value).then(val => responses.push(val));
    }

    while (responses.length < this.w) {
      await sleep(0.25);
    }

    return true;
  }

  async read(key: any): Promise<DatabaseEntry | undefined> {
    const responses: DatabaseEntry[] = [];

    for (const replica of this.replicas) {
      replica.read(key).then(val => responses.push(val as DatabaseEntry));
    }

    while (responses.length < this.r) {
      await sleep(0.25);
    }

    const latestVersion = Math.max(...responses.map(r => r.version));

    return responses.find(response => response.version === latestVersion);
  }

  nodesAreConsistent(): boolean {
    const expectedData: string = this.replicas[0].getStringifiedNodeData();

    for (const replica of this.replicas) {
      if (replica.getStringifiedNodeData() !== expectedData) {
        return false;
      }
    }

    return true;
  }
}

export class MultiLeaderDatabase extends Database {
  leaders: DatabaseReplica[];
  followers: DatabaseReplica[];

  constructor(numReplicas = 2, avgNetworkDelay = 1, avgPacketLoss = 0.1) {
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

  nodesAreConsistent(): boolean {
    const expectedData: string = this.leaders[0].getStringifiedNodeData();

    for (const replica of this.replicas) {
      if (replica.getStringifiedNodeData() !== expectedData) {
        return false;
      }
    }

    return true;
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
