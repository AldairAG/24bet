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
import Deporte from './pages/usuario/evento/DeportePage'
import EventoPage from './pages/usuario/evento/Evento'
import LigaPage from './pages/usuario/evento/LigaPage'
import DepositoPage from './pages/usuario/transacciones/DepositoPage'
import RetiroPage from './pages/usuario/transacciones/RetiroPage'
import PerfilPage from './pages/usuario/perfil/PerfilPage'
import HistorialApuestasPage from './pages/usuario/evento/HistorialApuestasPage'
import DefaultPage from './pages/usuario/DefaultPage'

function App() {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />

            <Route path={ROUTES.USER_CONTAINER} element={<UserContainer />} >

              <Route path={ROUTES.USER_DEPORTE(":deporte")} element={<Deporte />}>
                <Route path={ROUTES.USER_LIGA(":deporte", ":liga")} element={<LigaPage />}>
                  <Route path={ROUTES.USER_EVENTO(":deporte", ":liga", ":evento")} element={<EventoPage />} />
                </Route>
              </Route>
             
              <Route path={ROUTES.USER_BET_HISTORY} element={<HistorialApuestasPage />} />
              <Route path={ROUTES.USER_DEPOSITO} element={<DepositoPage />} />
              <Route path={ROUTES.USER_RETIRO} element={<RetiroPage />} />

              <Route path={ROUTES.USER_PERFIL} element={<PerfilPage />} >
                {/* Rutas de perfil */}
              </Route>
              <Route path={ROUTES.USER_HOME} element={<Home />} />
              <Route path="*" element={<DefaultPage />} />

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
