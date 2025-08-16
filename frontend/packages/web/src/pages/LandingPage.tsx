import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Eye, EyeOff, Mail, Lock, User, TrendingUp } from 'lucide-react';
import { useAuth } from '@24bet/shared';
import type { LoginRequest, RegistroRequest } from '@24bet/shared';

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Usar el hook de autenticación
  const { login, register, loading, error, clearError } = useAuth();

  // Validación para Login
  const loginValidationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  });

  // Validación para Registro - actualizada según RegistroRequest
  const registerValidationSchema = Yup.object({
    username: Yup.string().required('Nombre de usuario requerido'),
    email: Yup.string().email('Email inválido').required('Email requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Confirmar contraseña requerida'),
    nombre: Yup.string().optional(),
    apellido: Yup.string().optional(),
    acceptTerms: Yup.boolean().oneOf([true], 'Debes aceptar los términos'),
  });

  const handleLogin = async (values: LoginRequest) => {
    try {
      clearError();
      const result = await login(values);
      if (result) {
        setIsLoginModalOpen(false);
        // Redirigir al cliente o dashboard
        console.log('Login exitoso:', result);
      }
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const openLoginModal = () => {
    clearError();
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    clearError();
    setIsRegisterModalOpen(true);
  };

  const closeLoginModal = () => {
    clearError();
    setIsLoginModalOpen(false);
  };

  const closeRegisterModal = () => {
    clearError();
    setIsRegisterModalOpen(false);
  };

  const handleRegister = async (values: any) => {
    try {
      clearError();
      const registerData: RegistroRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        nombre: values.nombre || undefined,
        apellido: values.apellido || undefined,
      };
      
      const result = await register(registerData);
      if (result) {
        closeRegisterModal();
        // Redirigir al cliente o dashboard
        console.log('Registro exitoso:', result);
      }
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold">24BET</span>
              <span className="block text-xs text-red-400">CRYPTO • CASINO • DEPORTES</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex space-x-4"
          >
            <button
              onClick={openLoginModal}
              className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-lg font-semibold"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={openRegisterModal}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 rounded-lg font-semibold shadow-lg"
            >
              Registrarse
            </button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            >
              EL FUTURO DEL
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                CASINO CRYPTO
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-blue-400">& DEPORTES</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto"
            >
              Apuesta en deportes y juega casino con Bitcoin, Ethereum y más de 50 criptomonedas. 
              Retiros instantáneos, bonos increíbles y la máxima seguridad blockchain.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={openRegisterModal}
                className="px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Comenzar a Apostar
              </button>
              <button className="px-12 py-5 border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white hover:text-red-600 transition-all duration-300">
                Ver Deportes
              </button>
            </motion.div>
          </div>
        </div>

        {/* Elementos flotantes animados */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 right-10 w-24 h-24 border-4 border-red-500/30 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-10 w-20 h-20 bg-blue-500/20 rounded-lg"
        />
      </main>

      {/* Features Section */}
      <section className="relative px-6 py-20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por qué elegir 24BET?</h2>
            <p className="text-xl text-gray-400">La plataforma más completa de casino y deportes crypto</p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: "₿",
                title: "50+ Criptomonedas",
                description: "Bitcoin, Ethereum, Litecoin y muchas más"
              },
              {
                icon: "⚡",
                title: "Retiros Instantáneos",
                description: "Recibe tus ganancias en segundos, no en días"
              },
              {
                icon: "🏆",
                title: "Apuestas Deportivas",
                description: "Fútbol, básquet, tenis y más de 30 deportes"
              },
              {
                icon: "🎰",
                title: "Casino en Vivo",
                description: "Dealers reales, blackjack, ruleta y poker"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-red-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para ganar en grande?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Únete a miles de apostadores que ya están ganando con criptomonedas
            </p>
            <button
              onClick={openRegisterModal}
              className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Registrarse Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLoginModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-blue-50"></div>
              
              <button
                onClick={closeLoginModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-red-600">24BET</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de vuelta</h2>
                  <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
                </div>

                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={loginValidationSchema}
                  onSubmit={handleLogin}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      {error && typeof error === 'string' && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                      
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type="email"
                          name="email"
                          placeholder="Correo electrónico"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Contraseña"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || (loading === true)}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting || loading ? 'Iniciando...' : 'Iniciar Sesión'}
                      </motion.button>
                    </Form>
                  )}
                </Formik>

                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    ¿No tienes cuenta?
                    <button
                      onClick={() => {
                      closeLoginModal();
                      openRegisterModal();
                    }}
                      className="ml-2 text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeRegisterModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-red-50"></div>
              
              <button
                onClick={closeRegisterModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">24BET</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear cuenta</h2>
                  <p className="text-gray-600">Únete a la revolución del casino crypto deportivo</p>
                </div>

                <Formik
                  initialValues={{ 
                    username: '', 
                    email: '', 
                    password: '', 
                    confirmPassword: '',
                    nombre: '',
                    apellido: '',
                    acceptTerms: false 
                  }}
                  validationSchema={registerValidationSchema}
                  onSubmit={handleRegister}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      {error && typeof error === 'string' && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type="text"
                          name="username"
                          placeholder="Nombre de usuario"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Field
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                          />
                          <ErrorMessage name="nombre" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Field
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                          />
                          <ErrorMessage name="apellido" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type="email"
                          name="email"
                          placeholder="Correo electrónico"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Contraseña"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirmar contraseña"
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="flex items-start space-x-3">
                        <Field
                          type="checkbox"
                          name="acceptTerms"
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <label className="text-sm text-gray-600">
                            Acepto los términos y condiciones y la política de privacidad
                          </label>
                          <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || (loading === true)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting || loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                      </motion.button>
                    </Form>
                  )}
                </Formik>

                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    ¿Ya tienes cuenta?
                    <button
                      onClick={() => {
                      closeRegisterModal();
                      openLoginModal();
                    }}
                      className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
