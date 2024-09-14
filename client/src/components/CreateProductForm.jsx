import React, { useRef, useState } from 'react'
import { PlusCircle , Upload , Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProductStore } from '../store/useProductStore'


const categories = ["jeans" , "t-shirt" , "shoes" , "glasses" , "jacket" , "suit" , "bag"]


const CreateProductForm = () => {

  const {createProduct , loading} = useProductStore()
  
  const imageRef = useRef(null)

  const [newProduct , setNewProduct] = useState({
    name : "" ,
    description : "" ,
    price : "" ,
    category : "" ,
    image : ""
  })


  const handleChange = (e) => {
    setNewProduct({...newProduct , [e.target.name] : e.target.value})
  }


  const handleImageChange = (e) => {
  
    const file = e.target.files[0]
  
    if(file){
      const reader = new FileReader()
      reader.onloadend = () => {setNewProduct({...newProduct , image : reader.result})}
      reader.readAsDataURL(file)
    }

  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createProduct(newProduct)
      setNewProduct({category : "" , description : "" , image : "" , name : "" , price : ""})
    } catch (error) {
      console.log(error)
    }
  }



  
  return (
    <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' initial={{opacity : 0 , y : 20}} animate={{opacity : 1 , y : 0}} transition={{duration : 0.8}}>

      <h2 className='text-3xl font-semibold mb-6 text-emerald-300'>Create new product</h2>

      <form className='space-y-5' onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Product name</label>
          <input type="text" name='name' value={newProduct.name} onChange={handleChange} className='mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-emerald-500' />
        </div>

        <div>
          <label htmlFor="description" className='block text-sm font-medium text-gray-300'>Product description</label>
          <textarea rows={3} type="text" name='description' value={newProduct.description} onChange={handleChange} className='mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-emerald-500' />
        </div>

        <div>
          <label htmlFor="price" className='block text-sm font-medium text-gray-300'>Product price</label>
          <input step={1} min={0} type="number" name='price' value={newProduct.price} onChange={handleChange} className='mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-emerald-500' />
        </div>

        <div>

          <label htmlFor="category" className='block text-sm font-medium text-gray-300'>Product category</label>
          
          <select value={newProduct.category} name="category" onChange={handleChange} className='mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:border-emerald-500'>
            <option disabled value="">Select Category</option>
            {categories.map((category , i) => (
              <option key={i} value={category}>{category}</option>
            ))}
          </select>

        </div>
        
  
        <div className='mt-2 mb-2 flex items-center'>

          <input ref={imageRef} onChange={handleImageChange} type="file" name='image' hidden accept='image/*' />
          
          <label onClick={() => imageRef.current.click()} htmlFor="image" className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none'>
            <Upload className='h-5 w-5 inline-block mr-2'/>
            Upload image
          </label>

          {newProduct.image && <span className='ml-3 text-sm text-gray-400'>image uploaded</span>}

        </div>

        <button disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-700 focus:outline-none transition duration-150 ease-in-out disabled:opacity-50">
          {
            loading 
            ? 
            ( 
            <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden="true"/>
              Loading...
            </>
            )
            :
            (
            <>
              <PlusCircle className='mr-2 h-5 w-5' aria-hidden="true"/>
              Create product
            </>
            )
            }
        </button>

      </form>

    </motion.div>
  )
}


export default CreateProductForm