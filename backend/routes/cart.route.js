import express from "express"
import { protectRoute } from "../middlewares/auth.js"
import { addToCart, clearCart, getCartProducts, removeAllProductItems, updateCartProductQuantity } from "../controllers/cart.controller.js"


const cartRouter = express.Router()


cartRouter.get("/" , protectRoute , getCartProducts)

cartRouter.post("/" , protectRoute , addToCart)

cartRouter.delete("/" , protectRoute , removeAllProductItems)

cartRouter.put("/:productId" , protectRoute , updateCartProductQuantity)

cartRouter.patch("/clear-cart" , protectRoute , clearCart)



export default cartRouter