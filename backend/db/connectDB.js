import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_DB_URL)
        const conn = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`TRENDY_CART DATABASE CONNECTED SUCCESSFULLY`.bgGreen.black)
    } catch (error) {
        console.log(`FAILED IN CONNECTION TO THE DATABASE ERR : ${error}`)
        process.exit(1)
    }
}


export default connectDB