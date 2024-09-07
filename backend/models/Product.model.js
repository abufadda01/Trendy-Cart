import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    price : {
        type : Number ,
        min : 0 ,
        required : true
    },
    image : {
        type : String ,
        required : [true , "product image is required"]
    },
    category : {
        type : String ,
        required : true
    },
    isFeatured : {
        type : Boolean ,
        default : false
    },
} , {timestamps : true})



const Product = mongoose.model("products" , productSchema)


export default Product