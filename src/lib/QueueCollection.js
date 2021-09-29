class Collection {
  constructor() {
    this.storage = [];
  }

  size() {
    return this.storage.length;
  }

  sortByCondition(condition) {
    this.storage.sort(condition);
  }
}

export class QueueCollection extends Collection {
  constructor(capacity = Infinity) {
    super();
    this.capacity = capacity;
    this.progress = false
  }

  enqueue(...item) {
    return new Promise((resolve, reject) => {
      if (this.isFull()) {
        reject("Queue is full.")
      }
      this.storage.push(...item);
      resolve(true)
    })
  }

  dequeue() {
    return this.storage.shift();
  }

  isQueueProgress() {
    return this.progress
  }

  setQueueProgress(status) {
    this.progress = status
  }

  isFull() {
    return this.capacity === this.size();
  }
}
