import React from 'react'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Createlisting from './pages/Createlisting'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/create-listing' element={<Createlisting/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App