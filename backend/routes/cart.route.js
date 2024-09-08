import express from "express"
import { protectRoute } from "../middlewares/auth.js"
import { addToCart, getCartProducts, removeAllProductItems, updateCartProductQuantity } from "../controllers/cart.controller.js"


const cartRouter = express.Router()


cartRouter.get("/" , protectRoute , getCartProducts)

cartRouter.post("/" , protectRoute , addToCart)

cartRouter.delete("/" , protectRoute , removeAllProductItems)

cartRouter.put("/:productId" , protectRoute , updateCartProductQuantity)



export default cartRouter