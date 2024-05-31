import React from 'react'
import Navbar from '../components/Navbar'
import Slice from '../components/Slice'
import Categories from '../components/Categories'
import Listings from '../components/Listings'
import Footer from '../components/Footer'

function Homepage() {
  return (
    <>
    <Navbar/>
    <Slice/>
    <Categories/>
    <Listings/>
    <Footer/>
    </>
  )
}

export default Homepage