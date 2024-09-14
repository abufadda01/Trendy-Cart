import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus , Mail , Lock , User , ArrowRight , Loader } from 'lucide-react'
import {motion} from "framer-motion"
import { useUserStore } from '../store/useUserStore'


const Login = () => {
  
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")

  const {login , isLoading} = useUserStore()

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await login({email , password}  )
    } catch (error) {
      console.log(error)
    }
  }


  
  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>

      <motion.div className='sm:mx-auto sm:w-full sm:max-w-md' initial={{opacity : 0 , y : -20}} animate={{opacity : 1 , y : 0}} transition={{duration : 0.8 , delay : 0.6}}>
        <h2 className='mt-6 mb-6 text-center text-4xl font-semibold text-emerald-400'>Login to your account</h2>
      </motion.div>
      
      <motion.div className='sm:mx-auto sm:w-full sm:max-w-md' initial={{opacity : 0 , y : 20}} animate={{opacity : 1 , y : 0}} transition={{duration : 0.8 , delay : 0.4}}>
        
        <div className='bg-gray-800 py-8 px-4 sm:rounded-lg sm:px-10'>

            <form onSubmit={handleSubmit} className='space-y-6'>

              <div>

                <label htmlFor="name" className='block text-md mb-2 font-medium text-gray-300'>Email address</label>
                
                <div className='mt-1 relative rounded-md shadow-sm'>
                  
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' aria-hidden="true"/>
                  </div>

                  <input type="email" placeholder='name@example.com' name='email' required value={email} onChange={(e) => setEmail(e.target.value)} className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500' />

                </div>
              
              </div>

              <div>

                <label htmlFor="name" className='block text-md mb-2 font-medium text-gray-300'>Password</label>
                
                <div className='mt-1 relative rounded-md shadow-sm'>
                  
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' aria-hidden="true"/>
                  </div>

                  <input type="password" placeholder='********' name='password' required value={password} onChange={(e) => setPassword(e.target.value)} className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500' />

                </div>
              
              </div>
              
              <button disabled={isLoading} className="w-full flex justify-center  py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-700 focus:outline-none transition duration-150 ease-in-out disabled:opacity-50">
                {
                  isLoading 
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
                      <UserPlus className='mr-2 h-5 w-5' aria-hidden="true"/>
                      Login
                    </>
                  )
                }
              </button>

            </form>

            <p className='mt-8 text-center text-sm text-gray-400'>
              don't have an account ?{""}
              <Link to={"/register"} className='font-medium text-emerald-400 ml-1 hover:text-emerald-300'>
                  Register here <ArrowRight className='inline h-4 w-4'/>
              </Link>
            </p>

        </div>

      </motion.div>


    </div>
  )

}


export default Login