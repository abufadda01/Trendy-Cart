import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`TRENDY_CART DATABASE CONNECTED SUCCESSFULLY`.bgGreen.black)
    } catch (error) {
        console.log(`FAILED IN CONNECTION TO THE DATABASE ERR : ${error}`)
        process.exit(1)
    }
}


export default connectDB