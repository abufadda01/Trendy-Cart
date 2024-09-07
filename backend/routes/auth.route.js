import express from "express"
import { register , login , logout , generateAccessToken } from "../controllers/auth.controller.js"

const authRouter = express.Router()


authRouter.post("/register" , register)

authRouter.post("/login" , login)

authRouter.post("/logout" , logout)

authRouter.post("/generate-access-token" , generateAccessToken)

// authRouter.post("/profile" , getProfile)



export default authRouter