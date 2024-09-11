import express from "express"
import { register , login , logout , generateAccessToken, getProfile } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.js"

const authRouter = express.Router()


authRouter.post("/register" , register)

authRouter.post("/login" , login)

authRouter.post("/logout" , logout)

authRouter.post("/generate-access-token" , generateAccessToken)

authRouter.post("/profile" , protectRoute , getProfile)



export default authRouter