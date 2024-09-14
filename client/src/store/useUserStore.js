// this file will contain the global state to access any related state key to the user

import {create} from "zustand"
import { axiosObj } from "../utils/axios"
import {toast} from "react-hot-toast"



// we use the set parameter to update any state value in the store by set({state_name : new_value})
// and we can access any of the state keys or functions by export the useUserStore() and use it in any component or page
export const useUserStore = create((set , get) => ({ 

    user : null,
    isLoading : false ,
    checkingAuth : true ,

    register : async ({name , email , password , confirmPassword}) => {

        set({isLoading : true})

        if(password !== confirmPassword){
            set({isLoading : false})            
            return toast.error("password not match")
        }

        try {
            const response = await axiosObj.post("/auth/register" , {name , email , password})
            set({user : response.data , isLoading : false})
        } catch (error) {
            set({isLoading : false})
            toast.error(error.response.data.msg)
        }

    },



    login : async ({email , password}) => {

        set({isLoading : true})

        if(!email || !password){
            set({isLoading : false})            
            return toast.error("email and password are required")
        }

        try {
            const response = await axiosObj.post("/auth/login" , {email , password})
            set({user : response.data , isLoading : false})
        } catch (error) {
            set({isLoading : false})
            toast.error(error.response.data.msg)
        }

    },



    logout : async () => {

        set({isLoading : true})

        try {
            await axiosObj.post("/auth/logout")
            set({user : null, isLoading : false})
        } catch (error) {
            set({isLoading : false})
            toast.error(error.response.data.msg)
        }

    },



    // to check if the user is logged in and not redirect to the login page on page refresh
    checkAuth : async () => {

        set({checkingAuth : true})

        try {
            const response = await axiosObj.post("/auth/profile")
            set({user : response.data , checkingAuth : false})
        } catch (error) {
            set({user : null , checkingAuth : false})
        }
    }


}))




// TODO : implement axios interceptors to refresh the access token