import { useState } from 'react'
import './App.css'
import './index.css'
import NavBar from './components/NavBar'
import Authentication from './pages/Authentication'
import { Routes, Route } from 'react-router'
import UserInfo from './pages/UserInfo'
import Services from './pages/Services'
import Shop from './pages/Shop'
import Rentals from './pages/Rentals'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transport from './pages/Transport'
import Role from './pages/Role'

export default function App() {

  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Authentication />} />
        <Route path='/role' element={<Role />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/userinfo' element={<UserInfo />} />
        <Route path='/services' element={<Services />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/rentals' element={<Rentals />} />
        <Route path='/transport' element={<Transport />} />
      </Routes>
    </>
  )
}
