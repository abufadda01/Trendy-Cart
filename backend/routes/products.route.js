import express from "express"

import { 
    createProduct, 
    deleteProduct, 
    getAllProducts , 
    getFeaturedProducts, 
    getProductsByCategory, 
    getRecommendationsProducts, 
    toggleFeaturedProduct
} from "../controllers/products.controller.js"

import { adminRoute, protectRoute } from "../middlewares/auth.js"


const productsRouter = express.Router()


productsRouter.get("/" , protectRoute , adminRoute , getAllProducts)

productsRouter.get("/featured" , getFeaturedProducts)

productsRouter.post("/" , protectRoute , adminRoute , createProduct)

productsRouter.delete("/:productId" , protectRoute , adminRoute , deleteProduct)

productsRouter.get("/recommendations" , getRecommendationsProducts)

productsRouter.get("/category/:category" , getProductsByCategory)

productsRouter.patch("/:productId" , protectRoute , adminRoute , toggleFeaturedProduct)



export default productsRouter