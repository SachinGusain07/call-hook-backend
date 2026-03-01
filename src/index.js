import express from "express"
import authRoute from "./routes/authRoutes.js";
import webHookRoute from "./routes/webhookRoute/webhookRoute.js";



const allRoute = express.Router();


allRoute.use("/auth" , authRoute)
allRoute.use("/webhook" ,  webHookRoute)



export default allRoute;
