import {sleep} from '../utilities/time-utilities';
import {Database} from './database';
import {DatabaseEntry} from './database-entry';

export class LeaderlessDatabase extends Database {
  r: number;
  w: number;

  constructor(
    r = 2,
    w = 2,
    numReplicas = 3,
    avgNetworkDelay = 0.1,
    avgPacketLoss = 0.1
  ) {
    if (r < 0 || r > numReplicas) {
      throw new Error('r value must be >= 0 and <= numReplicas');
    }

    if (w < 0 || w > numReplicas) {
      throw new Error('w value must be >= 0 and <= numReplicas');
    }

    if (w + r <= numReplicas) {
      throw new Error('w + r must be > numReplicas to achieve strict quorom');
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
      await sleep(0.01);
    }

    return true;
  }

  async read(key: any): Promise<DatabaseEntry | undefined> {
    const responses: DatabaseEntry[] = [];

    for (const replica of this.replicas) {
      replica.read(key).then(val => responses.push(val as DatabaseEntry));
    }

    while (responses.length < this.r) {
      await sleep(0.01);
    }

    const latestVersion = Math.max(
      ...responses.filter(r => r !== undefined).map(r => r.version)
    );

    return responses.find(
      response => response !== undefined && response.version === latestVersion
    );
  }
}
