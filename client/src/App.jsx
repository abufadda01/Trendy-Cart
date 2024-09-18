import React, { useEffect } from 'react'
import {BrowserRouter as Router , Routes , Route, Navigate} from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/useUserStore'

import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'

import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import CartPage from './pages/CartPage'
import { useCartStore } from './store/useCartStore'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'



const App = () => {

  const {user , checkAuth , checkingAuth} = useUserStore()
  const {getCartItems} = useCartStore()


  useEffect(() => {
    checkAuth() // to keep checking if the user is logged in when refresh the page , and we add it inside useEffect in the App component because its the first thing that being rendered  
  } , [checkAuth])


  useEffect(() => {
    if(!user) return
    getCartItems() // to keep getting the user cartItems and to not lose them on a page refresh 
  } , [getCartItems , user])

 
  if(checkingAuth) return <LoadingSpinner/>



  return (

    <div className='min-h-screen bg-gray-900 overflow-hidden text-white relative'>

      <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

      <div className='relative z-50 pt-20'>

        <Router>

          <Navbar/>

            <Routes>
              <Route path='/' element={user ? <HomePage/> : <Navigate to="/login"/>}/>
              <Route path='/register' element={user ? <Navigate to="/"/> : <Register/>}/>
              <Route path='/login' element={user ? <Navigate to="/"/> : <Login/>}/>
              <Route path='/admin-dashboard' element={user?.role === "admin" ? <AdminPage/> : <Navigate to="/login"/>}/>
              <Route path='/category/:category' element={user ? <CategoryPage/> : <Navigate to="/login"/>}/>
              <Route path='/cart' element={user ? <CartPage/> : <Navigate to="/login"/>}/>
              <Route path='/purchase-success' element={user ? <PurchaseSuccessPage/> : <Navigate to="/login"/>}/>
              <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage/> : <Navigate to="/login"/>}/>
            </Routes>

            <Toaster/>

        </Router>

      </div> 

    </div>
  )
}


export default App 