import createError from "../utils/createError.js"
import Coupon from "../models/Coupon.model.js"
import Order from "../models/Order.model.js"
import {stripe} from "../db/stripe.js"
import { createStripeCoupon } from "../utils/createStripeCoupon.js"
import { createNewCoupon } from "../utils/createNewCoupon.js"



const createCheckoutSession = async (req , res , next) => {

    try {
        
        const {products , couponCode} = req.body

        if(!Array.isArray(products) || products.length === 0){
            return next(createError("empty products cart" , 400))
        }

        let coupon = null
        let totalAmount = 0

        const lineItems = products.map((product) => {

            const productPrice = Math.round(product.price * 100) // to convert the product price to cents value format
            const productQuantity = product.quantity
            totalAmount += productPrice * productQuantity

            return{
                price_data : {
                    currency : "usd" ,
                    product_data : {
                        name : product.name ,
                        images : [product.image]
                    },
                    unit_amount : productPrice
                },
                quantity: productQuantity 
            }

        })


        if(couponCode){

            coupon = await Coupon.findOne({code : couponCode , userId : req.user._id , isActive : true})

            if(coupon){
                totalAmount -= Math.round(totalAmount * coupon.discountPercentege / 100) // apply the coupon discount lets say the totalAmount is 100 and the coupon discount is 20 the formula will be like (100 * 20/100) so the discount will be 20 then minuse the 20 from out totalAmount then it will become 80
            }

        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card" , "paypal"],
            line_items : lineItems,
            mode : "payment" ,
            success_url : `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts : coupon ? [{coupon : await createStripeCoupon(coupon.discountPercentege)}] : [] ,
            metadata : { // Metadata: The session stores metadata such as userId, couponCode, and the serialized products list, which will be used later in the order creation process.
                userId : req.user._id.toString() , 
                couponCode : couponCode || "" ,
                products : JSON.stringify(
                    products.map((product) => ({
                        id : product._id ,
                        quantity : product.quantity ,
                        price : product.price
                    }))
                )
            }
        })


        // if the user buy with more than 200 dollars (20000) in cents format we will create a discount coupon for him to the next purchase operation and save the coupon in the db
        if(totalAmount > 20000){
            await createNewCoupon(req.user._id)
        }


        res.status(200).json({id : session.id , totalAmount : totalAmount / 100}) // to get the totalAmount in dollars format we divide it with 100 (convert from cents to dollar format)


    } catch (error) {
        next(error)
    }

}





const checkOrderSuccess = async (req , res , next) => {

    try {
        
        const {sessionId} = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        // the keys inside the metadata will be set when we create our session id when create new order
        if(session.payment_status === "paid"){

            if(session.metadata.couponCode){
                await Coupon.findByIdAndUpdate({userId : session.metadata.userId , code : session.metadata.couponCode} , {isActive : false} , {new : true})
            }

            const products = JSON.parse(session.metadata.products)

            const newOrder = new Order({
                user : session.metadata.userId ,
                products : products.map((product) => ({
                    product : product.id ,
                    quantity : product.quantity ,
                    price : product.price
                })),
                totalAmount : session.amount_total / 100,
                stripeSessionId : session.id
            })

            await newOrder.save()

            res.status(200).json({
                message : "Paymeny successful , order created " ,
                orderId : newOrder._id
            })

        }else {
            return next(createError("Payment not completed or failed" , 400))
        }


    } catch (error) {
        next(error)
    }

}





export {createCheckoutSession , checkOrderSuccess}