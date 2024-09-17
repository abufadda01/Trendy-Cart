import {create} from "zustand"
import { axiosObj } from "../utils/axios"
import {toast} from "react-hot-toast"



export const useProductStore = create((set , get) => ({

    products : [] ,
    loading : false ,

    setProducts : (products) => set({products}) ,

    createProduct : async (product) => { 
 
        set({loading : true})

        try {
            const response = await axiosObj.post('/products' , product)
            set((prevState) => ({products : [...prevState.products , response.data] , loading : false}))
            toast.success("product added successfully")
        } catch (error) {
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },



    getAllProducts : async () => {

        set({loading : true})

        try {
            const response = await axiosObj.get(`/products`)
            set({products : response.data.products , loading : false})
        } catch (error) { 
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },
 
 

    deleteProduct : async (productId) => {

        set({loading : true})

        try {
            await axiosObj.delete(`/products/${productId}`)
            set((prevState) => ({products : prevState.products.filter(product => product._id !== productId) , loading : false}))
        } catch (error) {
            set({loading : false})
            toast.error(error?.response?.data?.msg)
        }
    },



    toggleFeaturedProduct: async (productId) => {

        set({ loading: true });

        try {
            const response = await axiosObj.patch(`/products/${productId}`);
            set((prevState) =>
                set({
                    products: prevState.products.map((product) =>
                        product._id === productId
                            ? { ...product, isFeatured: response.data.isFeatured }
                            : {...product}
                    ),
                    loading: false,
                })
            );

        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.msg);
        }


    },



    getProductsByCategory : async (category) => {

        set({ loading: true });

        try {
            const response = await axiosObj.get(`/products/category/${category}`);
            set({products : response.data.products , loading : false})

        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.msg);
        }
    } 




}));

