import React from 'react'
import LandingPage from '../pages/LandingPage'
import Nav from "../components/Nav"
const HomePage = () => {
  return (
    <div>
      <Nav />
      <LandingPage loggedIn={true} />
    </div>
  )
}

export default HomePage
