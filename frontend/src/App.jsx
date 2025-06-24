import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'


const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers }=useAuthStore()
  const { theme } = useThemeStore();

  console.log({onlineUsers})
  

  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  // console.log({authUser })

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }
  // console.log(theme)
  return (
   <div>


    <Navbar></Navbar>
    <Routes>
      <Route path='/' element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
      <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to="/"/>}/> 
      <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
      <Route path='/settings' element={<SettingPage/>}/>

    </Routes>

    <Toaster/>


   </div>
  )
}

export default App