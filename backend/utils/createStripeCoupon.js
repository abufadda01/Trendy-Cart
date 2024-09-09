import { stripe } from "../db/stripe.js"


export const createStripeCoupon = async (discountPercentage) => {

    const coupon = stripe.coupons.create({
        percent_off : discountPercentege ,
        duration : "once"
    })

    return coupon.id
}