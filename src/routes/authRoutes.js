import express from "express"
import { loginUser, refreshAccessToken } from "../controllers/auth/authentication.controller.js";
import { createRegistration, listRegistrations } from "../controllers/auth/registrationController.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js"
const authRoute = express.Router();





authRoute.post("/login" ,  loginUser)
authRoute.post("/register" ,  createRegistration)

// authRoute.get('/registrations' , isAuthenticated , isAllowedRoles("admin") ,  listRegistrations)


authRoute.post("/refresh-token" , refreshAccessToken )


export default authRoute;