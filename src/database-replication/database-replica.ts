import {NetworkConnection} from '../utilities/network-connection';
import {DatabaseEntry} from './database-entry';

export class DatabaseReplica {
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
