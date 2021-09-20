import ApplicationCore from '../index';
import { API_ANIMATED_GIFT_HANDLER, API_MESSAGE_HANDLER } from '../consts/event'
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI, } from '../lib/api/DomUpdate';


const isGiftAnimating = new Promise(resolve => {
  // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
  // In this example, we use setTimeout(...) to simulate async code.
  // In reality, you will probably be using something like XHR or an HTML5 API.

  setInterval( () => {
    const { animatedGiftEventQueue } = ApplicationCore
    if (animatedGiftEventQueue.isQueueProgress() && !isPossiblyAnimatingGift() && !isAnimatingGiftUI()) {
      animatedGiftEventQueue.setQueueProgress(false)
      resolve(animatedGiftEventQueue.size())
    }
  }, 500)
})

export default function ClientEventHandler () {
  const { animatedGiftEventQueue, messageEventQueue, eventReactor } = ApplicationCore

  eventReactor.eventListener(API_MESSAGE_HANDLER, () => {
    const shiftQueue = messageEventQueue.dequeue()
    addMessage(shiftQueue)
  });

  eventReactor.eventListener(API_ANIMATED_GIFT_HANDLER, async () => {
    if (!animatedGiftEventQueue.isQueueProgress()) {
      animatedGiftEventQueue.setQueueProgress(true)
      const isThereNext = await isGiftAnimating
      const shiftQueue = animatedGiftEventQueue.dequeue()
      animateGift(shiftQueue)
      if (isThereNext) {
        eventReactor.dispatchEvent(API_ANIMATED_GIFT_HANDLER)
      }
    }
  });
}
