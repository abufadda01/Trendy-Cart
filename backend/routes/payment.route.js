import express from "express"

import { adminRoute, protectRoute } from "../middlewares/auth.js"
import { checkOrderSuccess , createCheckoutSession } from "../controllers/payment.controller.js"


const paymentRouter = express.Router()
 

paymentRouter.post("/create-checkout-session" , protectRoute , createCheckoutSession)

paymentRouter.post("/checkout-order-success" , protectRoute , checkOrderSuccess)



export default paymentRouter