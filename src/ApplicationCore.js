import EventReactor from "./lib/EventReactor";
import { QueueCollection } from './lib/QueueCollection';
import { API_EVENT_TYPE } from './lib/api';
import { API_ANIMATED_GIFT_HANDLER, API_MESSAGE_HANDLER } from './consts/event'


export default class ApplicationCore {
  constructor(executeBufferTime, eventShowTimeout) {
    this.executeBufferTime = (Date).now() + executeBufferTime;
    this.events = new Set();
    this.messageEventQueue = new QueueCollection();
    this.animatedGiftEventQueue = new QueueCollection();
    this.apiQueue = new QueueCollection();
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
        const event = this.apiQueue.dequeue()
        if (event) {
          this.addEvent(event)
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
    this.sortByTimestamp(eventQueue)
    this.eventReactor.dispatchEvent(
      messageEventType ? API_MESSAGE_HANDLER : API_ANIMATED_GIFT_HANDLER
    );
  }

  async mergeApiEventHandler(events) {
    await this.apiQueue.enqueue(
              ...events.filter(({ id }) => id)
                .filter(({ timestamp }) => timestamp.getTime() > this.executeBufferTime)
            )
  }

  sortByTimestamp(queueCollection) {
    const condition = (first, second) => first.timestamp - second.timestamp
    queueCollection.sortByCondition(condition);
  }

}
