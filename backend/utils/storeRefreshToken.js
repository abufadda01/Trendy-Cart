import {redis} from "../db/redis.js"


export const storeRefreshToken = async (userId , refreshToken) => {
    // set key&value pair in our redis db , also we add the userId to the key name to make it unique and could access it to different users 
    // .set() method check if this key already exist it updates it else it create a new one
    await redis.set(`refresh_token:${userId}` , refreshToken , "EX" , 7 * 24 * 60 * 60 * 1000)
}