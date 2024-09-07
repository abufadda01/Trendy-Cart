import createError from "../utils/createError.js"
import User from "../models/User.model.js"
import jwt from "jsonwebtoken"



const protectRoute = (req , res , next) => {

    try {
        
        const accessToken = req.cookies.accessToken

        if(!accessToken){
            return next(createError("Not Authorized" , 401))
        }

        jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET , async (err , decodedToken) => {

            if(err) {
                return next(createError("Access Forbiden" , 403))
            }

            const user = await User.findById(decodedToken.userId).select("-password")

            if(!user){
                return next(createError("User not found Forbiden" , 404))
            }

            req.user = user

            next()

        })        


    } catch (error) {
        next(error)
    }

}




const adminRoute = (req , res , next) => {

    try {
        
        if(req.user && req.user.role === "admin"){
            next()
        }else{
            return next(createError("Access Forbiden" , 403))
        }

    } catch (error) {
        next(error)
    }

}




export {protectRoute , adminRoute}

// In short, 401 is about authentication failure, while 403 is about authorization failure.







