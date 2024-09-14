import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import colors from "colors"
import errorHandler from "./middlewares/errorHandler.js"

import authRouter from "./routes/auth.route.js"
import productsRouter from "./routes/products.route.js"
import cartRouter from "./routes/cart.route.js"
import couponRouter from "./routes/coupon.route.js"
import paymentRouter from "./routes/payment.route.js"
import analyticsRouter from "./routes/analytics.route.js"

import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"


dotenv.config({path : "./.env"})

const app = express()


app.use(express.json({limit : "10mb"}))
app.use(cors({credentials : true}))
app.use(express.urlencoded({extended : true}))
app.use(cookieParser()) // to parse and could access our req cookies



app.use("/api/auth" , authRouter)
app.use("/api/products" , productsRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/coupons" , couponRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/analytics" , analyticsRouter)
 


app.use(errorHandler)


const PORT = process.env.PORT || 3001

const start = async () => {
    try {
        app.listen(PORT , console.log(`TrendyCart server started on port ${PORT}`.bgBlue.gray))
        await connectDB()
    } catch (error) {
        console.log(error)
    }
}


start()