export class DatabaseEntry {
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
