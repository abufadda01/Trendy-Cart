import Product from "../models/Product.model.js"
import createError from "../utils/createError.js"



const getCartProducts = async (req , res , next) => {

    try {
        
        const products = await Product.find({_id : {$in : req.user.cartItems}})

        // add quantity key to the fetched products
        const cartItems = products.map((product) => {
            
            // get the product object from the user cartItems that matched any of the matched fetched products (to get the quantity key from each object in the user cartItems and add it to every product object)
            const productInUserCart = req.user.cartItems.find(cartItem => cartItem._id === product._id) 
            
            return {
                ...product.toJSON() ,
                quantity : productInUserCart.quantity
            }

        })

        res.status(200).json(cartItems)

    } catch (error) {
        next(error)
    }

}




const addToCart = async (req , res , next) => {

    try {
        
        const {productId} = req.body
        const user = req.user

        const isProductExistInCart = user.cartItems.find(cartItem => cartItem._id.toString() === productId.toString())

        // if the product already exist in user cart we just increase the quantity by one , else the product is not in the user cartItems so we add it (push it)
        if(isProductExistInCart){
            isProductExistInCart.quantity += 1
        }else{
            user.cartItems.push(productId)
        }

        await user.save()

        res.status(200).json(user.cartItems)

    } catch (error) {
        next(error)
    }

}




const removeAllProductItems = async (req , res , next) => {

    try {
        
        const {productId} = req.body
        const user = req.user

        if(!productId){
            user.cartItems = []
        }else{
            // remove the product from our cart with its all quantity
            user.cartItems = user.cartItems.filter(cartItem => cartItem._id !== productId)
        }

        await user.save()

        res.status(200).json(user.cartItems)

    } catch (error) {
        next(error)
    }

}




const updateCartProductQuantity = async (req , res , next) => {

    try {

        const {productId} = req.params
        const {newQuantity} = req.body
        const user = req.user

        const isProductExistInCart = user.cartItems.find(cartItem => cartItem._id === productId)

        if(!isProductExistInCart){
            return next(createError("Product not exist" , 404))
        }

        if(isProductExistInCart){

            if(newQuantity === 0){ // if the new quantity value is zero thats mean we must remove this product from our cartItems
                user.cartItems = user.cartItems.filter(cartItem => cartItem._id !== productId)
                await user.save()
                return res.status(200).json(user.cartItems)
            }

            isProductExistInCart.quantity = newQuantity
            await user.save()
            res.status(200).json(user.cartItems)

        }

    } catch (error) {
        next(error)
    }

}





export {getCartProducts , addToCart , removeAllProductItems , updateCartProductQuantity}




