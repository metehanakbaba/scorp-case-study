import EventReactor from "./lib/EventReactor";
import { QueueCollection } from './lib/QueueCollection';
import { API_EVENT_TYPE } from './lib/api';
import { API_QUEUE_NAME } from './consts/event'


export default class ApplicationCore {
  constructor() {
    this.events = new Set();
    this.messageEventQueue = new QueueCollection();
    this.animatedGiftEventQueue = new QueueCollection();
    this.eventReactor = new EventReactor();
    this.registerEvents()
  }

  registerEvents () {
    this.eventReactor.registerEvent(API_QUEUE_NAME)
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
    this.eventReactor.dispatchEvent(API_QUEUE_NAME);

    this.sortByTimestamp(eventQueue)
  }

  setEventHandler(events) {
    events.filter(item => item.id)
          .forEach(async (event) => await this.addEvent(event));
  }

  sortByTimestamp(queueCollection) {
    const condition = (first, second) => first.timestamp - second.timestamp
    queueCollection.sortByCondition(condition);
  }

}
