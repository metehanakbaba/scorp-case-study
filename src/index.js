import ApplicationCore from "./ApplicationCore";
import ClientEventHandler from "./handlers/ClientEventHandler";
import { APIWrapper } from './lib/api';

const ApplicationCoreExport = new ApplicationCore();
(new APIWrapper()).setEventHandler(events => ApplicationCoreExport.setEventHandler(events));

export default ApplicationCoreExport;

ClientEventHandler();


