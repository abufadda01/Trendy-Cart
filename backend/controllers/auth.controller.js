import Joi from "joi"
import createError from "../utils/createError.js"
import User from "../models/User.model.js"
import { generateTokens } from "../utils/generateTokens.js"
import { storeRefreshToken } from "../utils/storeRefreshToken.js"
import { setCookies } from "../utils/setCookies.js"
import jwt from "jsonwebtoken"
import { redis } from "../db/redis.js"



const register = async (req , res , next) => {

    const registerSchema = Joi.object({
        name : Joi.string().required(),
        email : Joi.string().email().required() ,
        password : Joi.string().min(6).required()
    })
    
    const {value , error} = registerSchema.validate(req.body)

    if(error){
        return next(createError("Invalid Credentials" , 400))
    }


    try {
        
        const {name , email , password} = value

        const isUserExist = await User.findOne({email})

        if(isUserExist){
            return next(createError("Email already exist" , 400))
        }

        const user = new User({
            name ,
            email ,
            password
        })

        await user.save()

        user.password = undefined

        const {accessToken , refreshToken} = generateTokens(user._id)

        await storeRefreshToken(user._id , refreshToken)

        setCookies(res , accessToken , refreshToken)

        res.status(201).json(user)

    } catch (error) {
        next(error)
    }

}




const login = async (req , res , next) => {

    const loginSchema = Joi.object({
        email : Joi.string().email().required() ,
        password : Joi.string().min(6).required()
    })
    
    const {value , error} = loginSchema.validate(req.body)

    if(error){
        return next(createError("Invalid Credentials" , 400))
    }

    try {
        
        const {email , password} = value

        const user = await User.findOne({email})

        if(!user){
            return next(createError("Invalid Credentials" , 400))
        }

        const isPasswordMatched = await user.comparePassword(password)
        
        if(!isPasswordMatched){
            return next(createError("Invalid Credentials" , 400))
        }

        user.password = undefined

        const {accessToken , refreshToken} = generateTokens(user._id)

        await storeRefreshToken(user._id , refreshToken)

        setCookies(res , accessToken , refreshToken)

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }

}




const logout = async (req, res, next) => {

    try {

      const refreshToken = req.cookies.refreshToken;
  
      if (refreshToken) {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        await redis.del(`refresh_token:${decodedToken.userId}`);
      }
  
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
  
      return res.status(200).json({ msg: "Logged out successfully" });

    } catch (error) {
      return next(error);
    }

  };



  // to generate a new access token once the old one expires to keep the user verified and could access protected routes , and to create the new access token user must pass the refresh token to make sure that the user is authenticated to generate a new access token for him (the main use of the refresh token)
  const generateAccessToken = async (req , res , next) => {

    try {
        
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken){
            return next(createError("No refresh token provided" , 401))
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const storedTokenRedis = await redis.get(`refresh_token:${decodedToken.userId}`)

        if(storedTokenRedis !== refreshToken){
            return next(createError("Invalid refresh token" , 401))
        }

        const newAccessToken = jwt.sign({userId : decodedToken.userId} , process.env.ACCESS_TOKEN_SECRET , {expiresIn : process.env.ACCESS_TOKEN_EXPIRES})

        res.cookie("accessToken" , newAccessToken , {
            httpOnly : true , 
            secure : process.env.NODE_ENV === "production" , 
            sameSite : "strict" ,
            maxAge : 15 * 60 * 1000 
        })
        
        res.status(200).json({ msg: "Token refreshed successfully" });

    } catch (error) {
        next(error)
    }

  }




  const getProfile = async (req , res , next) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        next(error)
    }
  }




  export {register , login , logout , generateAccessToken , getProfile}



