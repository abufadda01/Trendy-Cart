import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import errorHandler from "./middlewares/errorHandler.js"
import cors from "cors"

import authRouter from "./routes/auth.route.js"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"


dotenv.config({path : "./.env"})

const app = express()


app.use(express.json())
app.use(cors({credentials : true}))
app.use(express.urlencoded({extended : true}))
app.use(cookieParser()) // to parse and could access our req cookies



app.use("/api/auth" , authRouter)
 


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