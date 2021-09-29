import EventReactor from "./lib/EventReactor";
import { QueueCollection } from './lib/QueueCollection';
import { API_EVENT_TYPE } from './lib/api';
import { API_ANIMATED_GIFT_HANDLER, API_MESSAGE_HANDLER } from './consts/event'


export default class ApplicationCore {
  constructor(executeBufferTime, eventShowTimeout) {
    this.executeBufferTime = executeBufferTime;
    this.events = new Set();
    this.messageEventQueue = new QueueCollection();
    this.animatedGiftEventQueue = new QueueCollection();
    this.eventReactor = new EventReactor();
    this.registerEvents()
    this.sendEventsFromApiQueue(eventShowTimeout)
  }

  registerEvents () {
    this.eventReactor.registerEvent(API_MESSAGE_HANDLER)
    this.eventReactor.registerEvent(API_ANIMATED_GIFT_HANDLER)
  }

  sendEventsFromApiQueue(timeout) {
    setInterval(() => {
      try {
        if (this.messageEventQueue.size()) {
          this.eventReactor.dispatchEvent(API_MESSAGE_HANDLER);
        }
        if (this.animatedGiftEventQueue.size()) {
          this.eventReactor.dispatchEvent(API_ANIMATED_GIFT_HANDLER);
        }
      } catch (e) {
        // LOGGING
      }
    }, timeout)
  }

  async addEvent(event) {
    const { id, type } = event
    if (this.events.has(id))
      return;
    this.events.add(id);

    const messageEventType = type === API_EVENT_TYPE.GIFT || type === API_EVENT_TYPE.MESSAGE
    const eventQueue = messageEventType ? this.messageEventQueue : this.animatedGiftEventQueue

    await eventQueue.enqueue(event);

    eventQueue.sortByCondition((first, second) => first.timestamp - second.timestamp)
  }

  async mergeApiEventHandler(events) {
    return events.filter(({ id }) => id)
      .forEach(event => this.addEvent(event))
  }

}
