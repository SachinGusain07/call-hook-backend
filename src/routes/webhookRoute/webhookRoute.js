import express from "express"
import { checkWebhookSubscription } from "../../middlewares/checkWebhookSubscription.js";
import { callingWebHook } from "../../webhook/webhook.js";





const webHookRoute = express.Router();





webHookRoute.post("/:webhookId", checkWebhookSubscription, callingWebHook);


export default  webHookRoute ;