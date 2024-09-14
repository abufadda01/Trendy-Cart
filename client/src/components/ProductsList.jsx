import React, { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import { motion } from 'framer-motion'
import { Star, Trash , ArrowBigRight , ArrowBigLeft } from 'lucide-react'


const ProductsList = ({}) => {

  const {getAllProducts , products , deleteProduct , toggleFeaturedProduct , } = useProductStore()

  useEffect(() => {
    getAllProducts()
  } , [getAllProducts])


  return (
    <motion.div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto' initial={{opacity : 0 , y : 20}} animate={{opacity : 1 , y : 0}} transition={{duration : 0.8}}>
      
      <table className='min-w-full divide-y divide-gray-700'>

        <thead>

          <tr>

            <th scope='col' className='px-6 py-3 text-left text-md font-medium text-gray-300 uppercase -tracking-wider'>
              Product
            </th>

            <th scope='col' className='px-6 py-3 text-left text-md font-medium text-gray-300 uppercase -tracking-wider'>
              Price
            </th>

            <th scope='col' className='px-6 py-3 text-left text-md font-medium text-gray-300 uppercase -tracking-wider'>
              Category
            </th>

            <th scope='col' className='px-6 py-3 text-left text-md font-medium text-gray-300 uppercase -tracking-wider'>
              Featured
            </th>

            <th scope='col' className='px-6 py-3 text-left text-md font-medium text-gray-300 uppercase -tracking-wider'>
              Actions
            </th>

          </tr>

        </thead>


        <tbody className='bg-gray-800 divide-y divide-gray-700'>

					{products?.map((product) => (

						<tr key={product?._id} className='hover:bg-gray-500 cursor-pointer transition duration-150'>

							<td className='px-6 py-6 whitespace-nowrap'>

								<div className='flex items-center'>

									<div className='flex-shrink-0 h-10 w-10'>

										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product?.image}
											alt={product?.name}
										/>

									</div>

									<div className='ml-4'>
										<div className='text-md font-medium text-white'>{product?.name}</div>
									</div>

								</div>

							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-md text-gray-300'>${product?.price.toFixed(2)}</div>
							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-md text-gray-300'>{product?.category}</div>
							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product?._id)}
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-6 w-6' />
								</button>

							</td>

							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product?._id)}
									className='text-red-600 transition-all duration-150 hover:text-red-400'
								>
									<Trash className='h-6 w-6' />
								</button>

							</td>

						</tr>

					))}

				</tbody>

      </table>

      {/* 
      <div className='flex justify-center gap-8 mt-4 mb-4'>

        <button onClick={handlePreviousPage} disabled={currentPage === 1} className='px-4 py-2 bg-gray-600 rounded cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed'>
          <ArrowBigLeft/>
        </button>

        <button onClick={handleNextPage} disabled={currentPage === totalPages} className='px-4 py-2 bg-gray-600 rounded cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed'>
          <ArrowBigRight/>
        </button>

      </div> */}

    </motion.div>
  )
}


export default ProductsList