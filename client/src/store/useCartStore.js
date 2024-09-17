import {create} from "zustand"
import { axiosObj } from "../utils/axios"
import {toast} from "react-hot-toast"


// we do same logic in the state in each function as the backend controllers do , to keep them synced togther , in crud operations specially

export const useCartStore = create((set , get) => ({

    cart : [] ,
    coupon : null ,
    total : 0 , // total will be the subTotal value with any discount value
    subTotal : 0 ,
    loading : 0 ,
    isCouponApplied : false ,


    getCartItems : async () => {
        set({loading : true})
        try {
            const resposne = await axiosObj.get("/cart")
            set({cart : resposne.data , loading : false})
            get().calculateTotals() // call the calculateTotals() function to recalculate the cart total , subTotal after get all cart items
        } catch (error) {
            set({cart : [] , loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },



    addToCart : async (product) => {
        set({loading : true})
        try {
            await axiosObj.post("/cart" , {productId : product?._id})
            toast.success("Product added to your cart")
            
            set((prevState) => {
                const isProductExist = prevState.cart.find(cartItem => cartItem._id === product._id)
                const updatedCart = isProductExist
                // if the product already exist in the user cart then i just want to iterate over all cart items and just update the qunatity of this item 
                ? prevState.cart.map((cartItem) => (cartItem._id === product._id ? {...cartItem , quantity : cartItem.quantity + 1} : cartItem))
                // if the product not exist in user cart then i will keep the cart array as it was and just add new object (new product in the cart) 
                : [...prevState.cart , {...product , quantity : 1} ]
                return {cart : updatedCart}
            })

            get().calculateTotals() // call the calculateTotals() function to recalculate the cart total , subTotal after add , remove items from the cart
        
        } catch (error) {
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },



    calculateTotals : async () => {
        set({loading : true})

        try {
            const {cart , coupon} = get() // to get any of the state keys , {state_key} = get()
            const subTotal = cart.reduce((sum , cartItem) => sum + (cartItem.price * cartItem.quantity) , 0)
            let total = subTotal

            if(coupon){
                const discount = subTotal * (coupon.discountPercentege / 100)
                total = subTotal - discount
            }

            set({subTotal , total}) // to set new Keys values we use set({key_name})

        } catch (error) {
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },



    removeAllProductItems : async (productId) => {
        set({loading : true})
        try {
            await axiosObj.delete('/cart' , {productId})
            set((prevState) => ({cart : prevState.cart.filter(cartItem => cartItem._id !== productId) , loading : false}))
            get().calculateTotals()
        } catch (error) {
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },
 


    updateProductQuantity : async (productId , newQuantity) => {
        set({loading : true})
        try {
            if(newQuantity === 0) return get().removeAllProductItems(productId) 
            await axiosObj.put(`/cart/${productId}` , {newQuantity})
            set((prevState) => ({cart : prevState.cart.map((cartItem) => cartItem._id === productId ? {...cartItem , quantity : newQuantity} : cartItem)}))
            get().calculateTotals()
        } catch (error) {
            set({loading : false}) 
            toast.error(error?.response?.data?.msg)
        }
    }


}))