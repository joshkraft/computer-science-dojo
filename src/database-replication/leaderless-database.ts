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
      throw new Error('w + r must be > numReplicas to achieve strict quorum');
    }

    super(numReplicas, avgNetworkDelay, avgPacketLoss);
    this.r = r;
    this.w = w;
  }

  /**
   * Writes a key value pair by writing to all nodes asynchronously, and then
   * waiting for confirmation from w nodes before considering the write a success.
   */
  async write(key: any, value: any): Promise<boolean> {
    let successfulWrites = 0;

    for (const replica of this.replicas) {
      replica.write(key, value).then(() => successfulWrites++);
    }

    while (successfulWrites < this.w) {
      await sleep(0.01);
    }

    return true;
  }

  /**
   * Reads the value for the provided key by sending the request to all nodes
   * asynchronously, and then waiting until responses are received from r nodes.
   * Then, the value with the highest 'version' is returned, as this represents
   * the most up to date data.
   */
  async read(key: any): Promise<DatabaseEntry | undefined> {
    const responses: DatabaseEntry[] = [];

    for (const replica of this.replicas) {
      replica.read(key).then(response => {
        if (response !== undefined) {
          responses.push(response);
        }
      });
    }

    while (responses.length < this.r) {
      await sleep(0.01);
    }

    const highestVersion = Math.max(...responses.map(r => r.version));

    return responses.find(response => response.version === highestVersion);
  }
}
