import express from "express"
import { loginUser, refreshAccessToken } from "../controllers/auth/authentication.controller.js";

const authRoute = express.Router();





authRoute.post("/login" ,  loginUser)
authRoute.post("/refresh-token" , refreshAccessToken )


export default authRoute;