import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </Provider>
  )
}


export default App
