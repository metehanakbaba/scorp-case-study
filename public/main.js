// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper(null, true);

api.setEventHandler((events) => {

  console.log(events)

})

// NOTE: UI helper methods from `dom_updates` are already imported above.
