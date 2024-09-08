import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , "name is required"]
    },
    email : {
        type : String ,
        unique : true ,
        lowercase : true ,
        trim : true ,
        required : [true , "Email is required"]
    },
    password : {
        type : String ,
        required : [true , "password is required"] ,
        minLength : [6 , "password must be at least 6 characters"]
    },
    cartItems : [ // every time i push a new item in the cart a new object been created and the qunatity key will created by default with 1 value and the product key will be the id to the product itself
        {
            quantity : {type : Number , default : 1} ,
            product : {type : mongoose.Schema.Types.ObjectId , ref : "products"}
        }
    ],
    role : {
        type : String ,
        enum : ["customer" , "admin"],
        default : "customer"
    }
} , {timestamps : true})




// pre save mongoose hook
userSchema.pre("save" , async function(next){
    
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword
    next()

})



userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password , this.password)
}




const User = mongoose.model("users" , userSchema)



export default User