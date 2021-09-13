
export default class EventReactor {
  constructor() {
    this.events = {};
  }

  registerEvent (eventName) {
    this.events[eventName] = new EventBase(eventName);
  }

  dispatchEvent (eventName, eventArgs) {
    this.events[eventName].callbacks.forEach(function(callback){
      callback(eventArgs);
    });
  }

  eventListener(eventName, callback) {
    this.events[eventName].registerCallback(callback);
  }
}

class EventBase {

  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }

  registerCallback(callback) {
    this.callbacks.push(callback);
  }
}
