import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import RegisterModal from '../components/modal/RegisterModal';
import LoginModal from '../components/modal/LoginModal';
import {
  SoccerIcon,
  TargetIcon,
  SecurityIcon,
  LightningIcon,
  Clock24Icon,
  TrophyIcon,
  GiftIcon,
  StarIcon,
  RocketIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon
} from '../components/Icons';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSportType, setActiveSportType] = useState('futbol');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleRegisterSuccess = (data: any) => {
    console.log('Usuario registrado exitosamente:', data);
    // Aquí puedes agregar lógica adicional como:
    // - Redirigir al usuario
    // - Guardar datos en el estado global
    // - Mostrar mensaje de bienvenida
  };

  const handleLoginSuccess = (data: any) => {
    console.log('Usuario logueado exitosamente:', data);
    // Aquí puedes agregar lógica adicional para el login exitoso
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  // Categorías deportivas principales
  const sportsCategories = [
    { 
      id: 'futbol', 
      name: 'Fútbol', 
      icon: SoccerIcon, 
      color: 'from-green-500 to-green-700',
      description: 'Liga MX, Champions, Premier'
    },
    { 
      id: 'nfl', 
      name: 'NFL', 
      icon: TargetIcon, 
      color: 'from-blue-500 to-blue-700',
      description: 'Football Americano'
    },
    { 
      id: 'live', 
      name: 'En Vivo', 
      icon: LightningIcon, 
      color: 'from-red-500 to-red-700',
      description: 'Apuestas en tiempo real'
    },
    { 
      id: 'esports', 
      name: 'E-Sports', 
      icon: TrophyIcon, 
      color: 'from-purple-500 to-purple-700',
      description: 'Deportes electrónicos'
    }
    
  ];

  // Slides promocionales deportivos
  const promoSlides = [
    {
      title: 'NFL IS BACK',
      subtitle: 'TEMPORADA 2024',
      description: 'Las mejores cuotas en',
      amount: 'FOOTBALL',
      currency: 'AMERICANO',
      bgGradient: 'from-blue-600 via-blue-700 to-black',
      ctaText: 'APUESTA YA',
      icon: TargetIcon
    },
    {
      title: 'FÚTBOL MEXICANO',
      subtitle: 'LIGA MX',
      description: 'Apuesta en el mejor',
      amount: 'FÚTBOL',
      currency: 'NACIONAL',
      bgGradient: 'from-green-600 via-green-700 to-black',
      ctaText: 'JUEGA AHORA',
      icon: SoccerIcon
    },
    {
      title: 'LIVE BET BUILDER',
      subtitle: 'APUESTAS EN VIVO',
      description: 'Construye tu apuesta con',
      amount: '+50%',
      currency: 'BOOST',
      bgGradient: 'from-red-600 via-red-700 to-black',
      ctaText: 'APOSTAR',
      icon: LightningIcon
    }
  ];

  // Pasos para empezar
  const startSteps = [
    {
      step: '1',
      title: 'REGÍSTRATE',
      subtitle: 'Registro fácil y rápido',
      icon: RocketIcon,
      description: 'Es gratis y solo toma 15 segundos'
    },
    {
      step: '2',
      title: 'DEPOSITA',
      subtitle: 'Recibe Bonos al instante',
      icon: GiftIcon,
      description: 'Múltiples métodos de pago'
    },
    {
      step: '3',
      title: 'APUESTA',
      subtitle: 'Disfruta de los mejores Deportes',
      icon: TrophyIcon,
      description: 'Miles de mercados disponibles'
    }
  ];

  // Deportes populares
  const popularSports = [
    { name: 'Liga MX', icon: SoccerIcon, matches: '12 partidos' },
    { name: 'NFL', icon: TargetIcon, matches: '8 juegos' },
    { name: 'Champions League', icon: SoccerIcon, matches: '6 partidos' },
    { name: 'Premier League', icon: SoccerIcon, matches: '10 partidos' },
    { name: 'MLB', icon: StarIcon, matches: '15 juegos' },
    { name: 'NBA', icon: TrophyIcon, matches: '12 juegos' }
  ];

  // Estadísticas deportivas destacadas
  const stats = [
    {
      icon: TrophyIcon,
      number: '$2,340,567',
      label: 'Ganado Esta Semana',
      color: 'text-yellow-400'
    },
    {
      icon: StarIcon,
      number: '127',
      label: 'Ganadores Diarios',
      color: 'text-orange-400'
    },
    {
      icon: TargetIcon,
      number: '500+',
      label: 'Mercados Deportivos',
      color: 'text-green-400'
    },
    {
      icon: Clock24Icon,
      number: '24/7',
      label: 'Apuestas en Vivo',
      color: 'text-blue-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-black text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Header estilo Caliente - Completamente responsive */}
      <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-red-600 to-red-800' 
          : 'bg-gradient-to-r from-red-500 to-red-700'
      }`}>
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl md:text-2xl font-bold text-white">24BET</h1>
                
                {/* Theme Toggle Button - Next to title */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-button flex items-center justify-center p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Cambiar tema"
                >
                  {isDarkMode ? (
                    <SunIcon size={20} className="text-yellow-400" />
                  ) : (
                    <MoonIcon size={20} className="text-gray-200" />
                  )}
                </button>
              </div>
              
              {/* Navigation - Hidden on mobile */}
              <nav className="hidden lg:flex space-x-4 xl:space-x-6">
                {sportsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveSportType(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm xl:text-base ${
                      activeSportType === category.id
                        ? 'bg-white text-red-600 shadow-md'
                        : 'text-white hover:bg-red-700'
                    }`}
                  >
                    <category.icon size={18} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Dropdown menu button - Always visible */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Menú"
                title="Abrir menú"
              >
                {isMobileMenuOpen ? (
                  <CloseIcon size={20} className="text-white" />
                ) : (
                  <MenuIcon size={20} className="text-white" />
                )}
              </button>

              {/* Auth buttons - Hidden on small screens */}
              <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 px-3 md:px-6 py-2 rounded-lg font-bold transition-colors text-sm md:text-base text-white"
                >
                  REGISTRARSE
                </button>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="border border-white hover:bg-white hover:text-red-600 px-3 md:px-6 py-2 rounded-lg font-bold transition-colors text-sm md:text-base text-white"
                >
                  INICIAR SESIÓN
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown Navigation Menu - Always available */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4 border-t border-red-700/50 mt-3 pt-3"
            >
              <div className="space-y-2">
                {/* Deportes - Siempre disponibles */}
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wide px-4 py-1">
                    Deportes
                  </h3>
                  {sportsCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveSportType(category.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSportType === category.id
                          ? 'bg-white text-red-600'
                          : 'text-white hover:bg-red-700'
                      }`}
                    >
                      <category.icon size={20} />
                      <div className="flex-1 text-left">
                        <span className="font-medium block">{category.name}</span>
                        <span className="text-xs opacity-75">{category.description}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Opciones adicionales para pantallas grandes */}
                <div className="space-y-2 pt-3 border-t border-red-700/50">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wide px-4 py-1">
                    Opciones
                  </h3>
                  <button 
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all font-medium"
                  >
                    <span>REGISTRARSE</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-white hover:bg-white hover:text-red-600 text-white transition-all font-medium"
                  >
                    <span>INICIAR SESIÓN</span>
                  </button>
                </div>
                
                {/* Botones de autenticación para pantallas pequeñas */}
                <div className="flex space-x-2 pt-3 sm:hidden border-t border-red-700/50">
                  <button 
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold transition-colors text-white"
                  >
                    REGISTRARSE
                  </button>
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 border border-white hover:bg-white hover:text-red-600 py-3 rounded-lg font-bold transition-colors text-white"
                  >
                    INICIAR SESIÓN
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section - Slider Principal - Completamente responsive */}
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {promoSlides.map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                x: currentSlide === index ? 0 : -100
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-red-200">
                      {slide.subtitle}
                    </p>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-base sm:text-lg md:text-xl text-white">
                      {slide.description}
                    </p>
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
                      {slide.amount}
                      {slide.currency && (
                        <span className="text-lg sm:text-2xl md:text-3xl ml-2">
                          {slide.currency}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg text-base sm:text-lg md:text-xl font-bold transition-colors shadow-lg">
                    {slide.ctaText}
                  </button>
                </div>
                
                {/* Icon - Hidden on small and medium screens, shown on large screens */}
                <div className="hidden xl:block">
                  <slide.icon size={280} className="text-white opacity-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicadores del slider */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sección de Pasos para Empezar - Completamente responsive */}
      <section className={`py-12 md:py-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 to-black' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ¿Cómo Apostar?
            </h2>
            <p className={`text-lg sm:text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Solo 3 pasos para comenzar a ganar
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {startSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`text-center p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-750' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl md:text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <step.icon size={50} className="text-red-500 mx-auto" />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-red-400 mb-4">{step.subtitle}</p>
                <p className={`text-sm md:text-base ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Estadísticas - Completamente responsive */}
      <section className="py-12 md:py-16 bg-red-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon size={40} className={`${stat.color} mx-auto mb-3 md:mb-4 md:!w-12 md:!h-12`} />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-red-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Juegos Populares - Completamente responsive */}
      <section className={`py-12 md:py-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Deportes Más Populares
            </h2>
            <p className={`text-lg sm:text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Los mejores mercados deportivos
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {popularSports.map((sport, index) => (
              <motion.div
                key={index}
                className={`p-4 md:p-6 rounded-xl text-center transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } shadow-md hover:shadow-lg`}
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <sport.icon size={40} className="text-red-500 mx-auto mb-3 md:mb-4 group-hover:text-red-400 transition-colors md:!w-12 md:!h-12" />
                <h3 className={`font-bold mb-2 text-sm md:text-base ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {sport.name}
                </h3>
                <div className={`text-xs md:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {sport.matches}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Características - Completamente responsive */}
      <section className={`py-12 md:py-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ¿Por Qué Elegir 24BET?
            </h2>
            <p className={`text-lg sm:text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              La mejor experiencia de apuestas deportivas
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <motion.div
              className={`text-center p-6 md:p-8 rounded-xl transition-all ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SecurityIcon size={50} className="text-green-500 mx-auto mb-4 md:!w-16 md:!h-16" />
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                100% Seguro
              </h3>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Licencias verificadas y encriptación SSL
              </p>
            </motion.div>
            <motion.div
              className={`text-center p-6 md:p-8 rounded-xl transition-all ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LightningIcon size={50} className="text-yellow-500 mx-auto mb-4 md:!w-16 md:!h-16" />
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Pagos Rápidos
              </h3>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Retiros instantáneos las 24 horas
              </p>
            </motion.div>
            <motion.div
              className={`text-center p-6 md:p-8 rounded-xl transition-all ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Clock24Icon size={50} className="text-blue-500 mx-auto mb-4 md:!w-16 md:!h-16" />
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Soporte 24/7
              </h3>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Atención al cliente permanente
              </p>
            </motion.div>
            <motion.div
              className={`text-center p-6 md:p-8 rounded-xl transition-all ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StarIcon size={50} className="text-purple-500 mx-auto mb-4 md:!w-16 md:!h-16" />
              <h3 className={`text-lg md:text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Mejores Cuotas
              </h3>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Las odds más competitivas del mercado
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Completamente responsive */}
      <footer className={`py-8 md:py-12 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-gray-100 border-gray-300'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className={`text-lg md:text-xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                24BET
              </h3>
              <p className={`text-sm md:text-base mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                La casa de apuestas más confiable de México. Juega responsablemente.
              </p>
              <div className="flex items-center space-x-4">
                <SecurityIcon size={20} className="text-green-500" />
                <span className={`text-xs md:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Licencia SEGOB
                </span>
              </div>
            </div>
            <div>
              <h4 className={`font-bold mb-4 text-sm md:text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Deportes
              </h4>
              <ul className={`space-y-2 text-xs md:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>Fútbol</li>
                <li>NFL</li>
                <li>Baloncesto</li>
                <li>Béisbol</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 text-sm md:text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ayuda
              </h4>
              <ul className={`space-y-2 text-xs md:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>Términos y Condiciones</li>
                <li>Juego Responsable</li>
                <li>Soporte</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 text-sm md:text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Contacto
              </h4>
              <div className={`space-y-2 text-xs md:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock24Icon size={14} />
                  <span>24/7 Soporte</span>
                </div>
                <div>soporte@24bet.mx</div>
              </div>
            </div>
          </div>
          <div className={`border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm transition-colors duration-300 ${
            isDarkMode 
              ? 'border-gray-800 text-gray-400' 
              : 'border-gray-300 text-gray-600'
          }`}>
            <p>© 2024 24BET. Todos los derechos reservados. Juega responsablemente. +18</p>
          </div>
        </div>
      </footer>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onOpenLogin={openLoginModal}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenRegister={openRegisterModal}
      />
    </div>
  );
};

export default LandingPage;
