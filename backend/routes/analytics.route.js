import express from "express"
import { adminRoute, protectRoute } from "../middlewares/auth.js"
import { getAnalyticsData } from "../controllers/analytics.controller.js"


const analyticsRouter = express.Router()


analyticsRouter.get("/" , protectRoute , adminRoute , getAnalyticsData)




export default analyticsRouter
