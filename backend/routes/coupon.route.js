import express from "express"
import { protectRoute } from "../middlewares/auth.js"
import { getUserCoupon, validateCoupon } from "../controllers/coupon.controller.js"


const couponRouter = express.Router()


couponRouter.get("/" , protectRoute , getUserCoupon)

couponRouter.get("/validate" , protectRoute , validateCoupon)




export default couponRouter
