import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App
