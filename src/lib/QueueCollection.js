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

  sliceByCondition(property, condition) {
    for (let i = 0; i < this.storage.length; i++) {
      if (condition(this.storage[i][property])) {
        if (i - 1 > 0) {
          this.storage.slice(i - 1);
        }
        break;
      }
    }

  }
}

export class QueueCollection extends Collection {
  constructor(capacity = Infinity) {
    super();
    this.capacity = capacity;
  }

  enqueue(item) {
    return new Promise((resolve, reject) => {
      if (this.isFull()) {
        reject("Queue is full.")
      }
      this.storage.push(item);
      resolve(true)
    })
  }

  dequeue() {
    return this.storage.shift();
  }

  isFull() {
    return this.capacity === this.size();
  }
}
