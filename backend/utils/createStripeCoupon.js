import { stripe } from "../db/stripe.js"


export const createStripeCoupon = async (discountPercentage) => {

    const coupon = stripe.coupons.create({
        percent_off : discountPercentage ,
        duration : "once"
    })

    return coupon.id
}