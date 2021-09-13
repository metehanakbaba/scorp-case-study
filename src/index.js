import { APIWrapper } from './lib/api';
import { APIWrapperEventHandler } from "./handlers/APIWrapperEventHandler";

export const apiEventHandler = new APIWrapperEventHandler();
(new APIWrapper()).setEventHandler(events => apiEventHandler.setEventHandler(events));
