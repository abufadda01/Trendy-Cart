import jwt from "jsonwebtoken"


// function the generate and return two tokens access_token : the short life one (15 min) , refreshToken : the long life one (7 days) that will be stored in redis to easy and fast access to it
export const generateTokens = (userId) => {

    const accessToken = jwt.sign({userId} , process.env.ACCESS_TOKEN_SECRET , {expiresIn : process.env.ACCESS_TOKEN_EXPIRES})
    
    const refreshToken = jwt.sign({userId} , process.env.REFRESH_TOKEN_SECRET , {expiresIn : process.env.REFRESH_TOKEN_EXPIRES})

    return {accessToken , refreshToken}

}