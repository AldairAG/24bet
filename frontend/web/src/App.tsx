import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <div>
      <Routes>
        <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
      </Routes>

    </div>
  )
}


export default App
