import { API_EVENT_TYPE, } from '../lib/api';
import { QueueCollection } from '../utils/QueueCollection';

export class APIWrapperEventHandler {
  constructor() {
    this.events = new Set();
    this.messageEventQueue = new QueueCollection();
    this.animatedGiftEventQueue = new QueueCollection();
  }

  async addEvent(event) {
    const { id, type } = event
    if (this.events.has(id))
      return;
    this.events.add(id);

    const eventQueue =
      type === API_EVENT_TYPE.GIFT || type === API_EVENT_TYPE.MESSAGE ?
        this.messageEventQueue : this.animatedGiftEventQueue

    await eventQueue.enqueue(event);
    this.sortByTimestamp(eventQueue)
  }

  setEventHandler(events) {
    if (events.length)
      events.forEach((event) => this.addEvent(event));
  }

  sortByTimestamp(queueCollection) {
    const condition = (first, second) => first.timestamp - second.timestamp
    queueCollection.sortByCondition(condition);
  }


}
