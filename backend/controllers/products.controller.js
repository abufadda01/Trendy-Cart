import { redis } from "../db/redis.js"
import Product from "../models/Product.model.js"
import createError from "../utils/createError.js"
import cloudinary from "../db/cloudinary.js"



const getAllProducts = async (req , res , next) => {

    try {
        
        const page = Number(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const products = await Product.find().skip(skip).limit(limit)

        const totalProducts = await Product.countDocuments()

        res.status(200).json({
            page ,
            totalPages : Math.ceil(totalProducts / limit) ,
            products ,
            totalProducts
        })

    } catch (error) {
        next(error)
    }
}




// we will store the featured products in redis database also to make the retreive operation more fast becasue they are available for all users (to make cached version of them)
const getFeaturedProducts = async (req , res , next) => {

    try {
        
        let featuredProducts = await redis.get("featured_products")

        // if we have featuredProducts from the redis database we will return it as response directly
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts)) // by default redis will save the data as string so we must parse to object
        }

        
        // if we don't have featuredProducts from the redis database we will get the featured products from the mongoDB first then store it in redis as a cached data for future data fetch
        featuredProducts = await Product.find({isFeatured : true}).lean() // .lean() return plain javascript object insted of mongodb document object which will improve our preformance

        if(!featuredProducts){
            return next(createError("No featured products found" , 404))
        }

        await redis.set("featured_products" , JSON.stringify(featuredProducts))

        res.status(200).json(featuredProducts)

    } catch (error) {
        next(error)
    }
}




const createProduct = async (req , res , next) => {

    try {
        
        const {name , description , price , category , image} = req.body

        let cloudinaryRes = null

        if(image){
           cloudinaryRes = await cloudinary.uploader.upload(image , {folder : "products"})
        }

        const product = new Product({
            name ,
            description ,
            category ,
            price ,
            image : cloudinaryRes?.secure_url ? cloudinaryRes?.secure_url : ""
        })

        await product.save()

        res.status(201).json(product)

    } catch (error) {
        next(error)
    }

}




const deleteProduct = async (req , res , next) => {

    try {
        
        const product = await Product.findById(req.params.productId)

        if(!product){
            return next(createError("Product not found" , 404))
        }

        // to delete the product image from the cloudinary to keep extra space
        if(product.image){

            const imageId = product.image.split("/").pop().split(".")[0]
            
            try {
                await cloudinary.uploader.destroy(`products/${imageId}`)
                console.log('product image deleted successfully')            
            } catch (error) {
                next(error)
            }
        
        }

        await Product.findByIdAndDelete(req.params.productId)

        res.status(200).json({msg : "product deleted successfully"})
    
    } catch (error) {
        next(error)
    }

}




const getRecommendationsProducts = async (req , res , next) => {

    try {
        
        const products = await Product.aggregate([
            {
                $sample : {size : 3} // The $sample stage is used to randomly select a specified number of documents from the collection.
                // In this case, { size: 3 } means the query will randomly pick 3 documents (products) from the Product collection.
            },
            {
                $project : { //The $project stage is used to shape or transform the documents by specifying which fields should be included or excluded in the result (project them with specific key)
                    _id : 1 ,
                    name : 1 ,
                    price : 1 ,
                    category : 1 ,
                    image : 1 ,
                }
            }
        ])

        res.status(200).json(products)


    } catch (error) {
        next(error)
    }

}




const getProductsByCategory = async (req , res , next) => {

    try {
        
        const page = Number(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit        
        
        const {category} = req.params

        const products = await Product.find({category}).skip(skip).limit(limit)

        const totalProducts = await Product.countDocuments()

        res.status(200).json({
            products ,
            page ,
            totalPages : Math.ceil(totalProducts / limit) ,
            totalProducts
        })

    } catch (error) {
        next(error)
    }

}




const toggleFeaturedProduct = async (req , res , next) => {

    try {
        
        const {productId} = req.params

        const product = await Product.findById(productId)

        if(!product){
            return next(createError("Product not found" , 404))
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId , {isFeatured : !product.isFeatured} , {new : true})
        
        await updateFeaturedProductsRedis() // to update the cached data version of the redis db after update the isFeatured key to the one of the products

        res.status(200).json(updatedProduct)

    } catch (error) {
        next(error)
    }

}




async function updateFeaturedProductsRedis() {
    try {
        const featuredProducts = await Product.find({isFeatured : true}).lean()
        await redis.set("featured_products" , JSON.stringify(featuredProducts))
    } catch (error) {
        next(error)
    }
}
 





export {
    getAllProducts , 
    getFeaturedProducts , 
    createProduct , 
    deleteProduct , 
    getRecommendationsProducts , 
    getProductsByCategory ,
    toggleFeaturedProduct
}

