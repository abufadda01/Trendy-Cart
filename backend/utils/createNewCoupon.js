import Coupon from "../models/Coupon.model.js"



export const createNewCoupon = async (userId) => {

    try {

        // to delete all user previous discounts code because each user could have single coupon at same time
        await Coupon.findOneAndDelete({userId})

        const newCoupon = new Coupon({
            userId,
            code : "GIFT" + Math.random().toString(36).substring(2 , 8).toUpperCase() ,
            discountPercentege : 10 ,
            expireDate : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) //30 days expiration
        })

        await newCoupon.save()

        return newCoupon

    } catch (error) {
        console.log(error)    
    }

}