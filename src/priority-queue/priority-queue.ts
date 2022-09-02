export class PriorityQueue {
  data: PriorityQueueEntry[];

  constructor() {
    this.data = [];
  }

  insertWithPriority(element: string, priority: number): void {
    const newEntry: PriorityQueueEntry = new PriorityQueueEntry(
      element,
      priority
    );

    for (let i = 0; i < this.data.length; i++) {
      const shouldInsertHere: boolean =
        this.data[i].priority > newEntry.priority;

      if (shouldInsertHere) {
        this.data.splice(i, 0, newEntry);
        return;
      }
    }

    this.data.push(newEntry);
    return;
  }

  pullHighestPriorityElement(): string | undefined {
    if (this.data.length) {
      return this.data.shift()?.element;
    }

    return;
  }
}

class PriorityQueueEntry {
  element: string;
  priority: number;

  constructor(element: string, priority: number) {
    this.element = element;
    this.priority = priority;
  }
}
