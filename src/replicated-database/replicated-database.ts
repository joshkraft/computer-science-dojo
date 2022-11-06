export class Database {
  replicas: NetworkConnection[];

  constructor(params: DatabaseParameters) {
    this.replicas = [];
    for (let i = 0; i < (params.numReplicas || 5); i++) {
      this.replicas.push(
        new NetworkConnection(
          params.avgNetworkDelay || 0.5,
          params.avgPacketLoss || 0.1,
          new DatabaseReplica()
        )
      );
    }
  }

  async write(key: string, value: number): Promise<number> {
    for (const replica of this.replicas) {
      replica.write(key, value);
    }

    let timeElapsed = 0;
    while (!this.nodesHaveWriteConsensus(key, value)) {
      await sleep(0.1);
      timeElapsed += 0.1;
    }

    return timeElapsed;
  }

  nodesHaveWriteConsensus(key: string, value: number): boolean {
    return this.replicas.every(
      nc =>
        nc.read(key) &&
        nc.read(key)!.value === value &&
        nc.getStringifiedNodeData() ===
          this.replicas[0].getStringifiedNodeData()
    );
  }
}

class NetworkConnection {
  avgNetworkDelay: number;
  avgPacketLoss: number;
  node: DatabaseReplica;

  constructor(
    avgNetworkDelay: number,
    avgPacketLoss: number,
    toNode: DatabaseReplica
  ) {
    this.avgNetworkDelay = avgNetworkDelay;
    this.avgPacketLoss = avgPacketLoss;
    this.node = toNode;
  }

  async write(key: string, value: number): Promise<boolean> {
    let isLostPacket = Math.random() < this.avgPacketLoss;
    while (isLostPacket) {
      await sleep(Math.random() * this.avgNetworkDelay);
      isLostPacket = Math.random() < this.avgPacketLoss;
    }

    await sleep(Math.random() * this.avgNetworkDelay);
    this.node.write(key, value);
    return true;
  }

  read(key: string): DatabaseEntry | undefined {
    return this.node.read(key);
  }

  getStringifiedNodeData(): string {
    return JSON.stringify(Array.from(this.node.data.entries()));
  }
}

class DatabaseReplica {
  data: Map<string, DatabaseEntry>;
  constructor() {
    this.data = new Map();
  }

  read(key: string): DatabaseEntry | undefined {
    return this.data.get(key);
  }

  write(key: string, value: number): void {
    this.data.set(key, new DatabaseEntry(value));
  }
}

class DatabaseEntry {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}

async function sleep(s: number) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

interface DatabaseParameters {
  numReplicas?: number;
  avgNetworkDelay?: number;
  avgPacketLoss?: number;
}
