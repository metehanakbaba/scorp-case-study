import ApplicationCore from "./ApplicationCore";
import ClientEventHandler from "./handlers/ClientEventHandler";
import { APIWrapper } from './lib/api';

const executeBufferTime = 20000 // ms
const eventShowTimeout = 500 // ms
const ApplicationCoreExport = new ApplicationCore(executeBufferTime, eventShowTimeout);
(new APIWrapper()).setEventHandler(async events => ApplicationCoreExport.mergeApiEventHandler(events));

export default ApplicationCoreExport;

ClientEventHandler();
