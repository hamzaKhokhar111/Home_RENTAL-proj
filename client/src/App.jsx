import React from 'react'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Createlisting from './pages/Createlisting'
import ListingDetails from './pages/ListingDetail'
import TripList from './pages/TripList'
import WishList from './pages/WishList'
import PropertyList from './pages/PropertyList'
import ReservationList from './pages/ReservationList'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import Aqib from './pages/Aqib'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/create-listing' element={<Createlisting/>} />
      <Route path='/properties/:category/:category' element={<CategoryPage/>} />
      <Route path='/properties/search/:/search'   element={<SearchPage/>}/>
      <Route path='/properties/:listingId' element={<ListingDetails/>} />
      <Route path='/:userId/trips' element={<TripList/>} />
      <Route path='/:userId/wishList' element={<WishList/>} />
      <Route path='/:userId/properties' element={<PropertyList/>} />
      <Route path='/:userId/reservations' element={<ReservationList/>} />
      <Route path='/aqib' element={<Aqib/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App