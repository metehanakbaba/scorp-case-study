import ApplicationCore from '../index';
import { API_QUEUE_NAME } from '../consts/event'
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI, } from '../lib/api/domUpdate';



export default function ClientEventHandler () {
  const { animatedGiftEventQueue, messageEventQueue, eventReactor } = ApplicationCore

  return eventReactor.eventListener(API_QUEUE_NAME, () => {

    const checkElementOnQueue = animatedGiftEventQueue.size() || messageEventQueue.size()

    if (checkElementOnQueue) {
      const isGift = !isPossiblyAnimatingGift() && !isAnimatingGiftUI()
      const shiftQueue = isGift ? animatedGiftEventQueue.dequeue() : messageEventQueue.dequeue()

      isGift && shiftQueue !== null ?
        animateGift(shiftQueue)
        :
        addMessage(shiftQueue)
      messageEventQueue.sliceByCondition('timestamp', (item) => item > Date.now())
      ;

    }
  });
}
