import {sleep} from './time-utilities';

export class NetworkConnection {
  avgDelay: number;
  avgPacketLoss: number;

  constructor(avgDelay: number, avgPacketLoss: number) {
    if (avgDelay < 0) {
      throw new Error('avgDelay must be >= 0');
    }

    if (avgPacketLoss < 0 || avgPacketLoss > 1) {
      throw new Error('avgPacketLoss must be >= 0 and <= 1');
    }

    this.avgDelay = avgDelay;
    this.avgPacketLoss = avgPacketLoss;
  }

  async delay() {
    while (Math.random() < this.avgPacketLoss) {
      await sleep(Math.random() * this.avgDelay);
    }

    await sleep(Math.random() * this.avgDelay);
  }
}
