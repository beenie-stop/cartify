import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import UserDashboard from './pages/user.jsx'
import Addproduct from './pages/addproduct.jsx'
import Cart from './pages/cart.jsx'
import Home from './pages/home.jsx'
import Orderstatus from './pages/orderstatus.jsx'
import AdminDashboard from './pages/admindashboard.jsx'
import Checkout from './pages/checkout.jsx'
import Thankyou from './pages/Thankyou.jsx'
import Profile from './pages/profile.jsx'
import ProductDetails from './pages/productDetails.jsx'



function App() {
  return (
    <>
   
       <Routes >     
           <Route path='/Login' element={<Login />} />   
           <Route path='/Register' element={<Register/>}/>  
           <Route path='/Dashboard' element={<UserDashboard/>}/>  
            <Route path='/Admin' element={<AdminDashboard/>}/> 
               <Route path='/Cart' element={<Cart/>}/>  
                <Route path='/Add' element={<Addproduct/>}/>  
                <Route path='/' element={<Home/>}/>  
                <Route path='/Status' element={<Orderstatus/>}/>  
                <Route path='/Checkout' element={<Checkout/>}/>  
              <Route path='/thankyou/:id' element={<Thankyou/>}/>
               <Route path='/profile' element={<Profile/>}/>
                <Route path='/productDetails/:id' element={<ProductDetails/>}/>


              </Routes>
    </>
  )

}
export default App;