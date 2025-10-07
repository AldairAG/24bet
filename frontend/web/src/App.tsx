import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { Provider } from 'react-redux'
import { store } from './store'
import UserContainer from './containers/UserContainer'
import AdminContainer from './containers/AdminContainer'
import Home from './pages/usuario/Home'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPeticiones from './pages/admin/Peticiones'
import AdminUsuarios from './pages/admin/Usuarios'
import EditarUsuario from './pages/admin/Editar'

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
            <Route path={ROUTES.USER_CONTAINER} element={<UserContainer />} >
              <Route path={ROUTES.HOME} element={<Home />} />
            </Route>
            <Route path={ROUTES.ADMIN_CONTAINER} element={<AdminContainer />} >
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN_PETICIONES} element={<AdminPeticiones />} />
              <Route path={ROUTES.ADMIN_USUARIOS} element={<AdminUsuarios />} />
              <Route path={`${ROUTES.ADMIN_USUARIOS_EDITAR}/:id`} element={<EditarUsuario />} />
            </Route>
          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}


export default App
