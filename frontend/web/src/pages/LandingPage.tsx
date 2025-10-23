import { useState } from 'react';
import { motion } from 'framer-motion';
import RegisterModal from '../components/modal/RegisterModal';
import LoginModal from '../components/modal/LoginModal';
import { MenuIcon, CloseIcon, TrophyIcon, RocketIcon } from '../components/Icons';
import logo24bet from '../assets/24bet.png';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Secciones simplificadas y visuales con esquema de colores rojo
  const features = [
    {
      icon: <RocketIcon size={32} className="text-red-600 mx-auto" />,
      title: 'Registro Express',
      desc: 'Crea tu cuenta en segundos y comienza a apostar.'
    },
    {
      icon: <TrophyIcon size={32} className="text-yellow-500 mx-auto" />,
      title: 'Premios diarios',
      desc: 'Gana bonos y recompensas cada día.'
    },
    {
      icon: <TrophyIcon size={32} className="text-red-600 mx-auto" />,
      title: 'Apuestas en vivo',
      desc: 'Siente la emoción de apostar mientras ves el partido.'
    }
  ];

  const benefits = [
    { emoji: '🎯', title: 'Cuotas competitivas', desc: 'Las mejores cuotas del mercado' },
    { emoji: '💰', title: 'Retiros rápidos', desc: 'Recibe tu dinero en minutos' },
    { emoji: '🔒', title: '100% Seguro', desc: 'Tus datos protegidos siempre' },
    { emoji: '📱', title: 'App móvil', desc: 'Apuesta desde cualquier lugar' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header rojo moderno */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-600 via-red-700 to-red-900 shadow-2xl border-b border-yellow-500/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo24bet} alt="24BET" className="h-10 object-contain drop-shadow-lg" />
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsRegisterModalOpen(true)} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-6 py-2.5 rounded-lg font-black text-sm transition shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105">
              REGISTRARSE
            </button>
            <button onClick={() => setIsLoginModalOpen(true)} className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-2.5 rounded-lg font-bold text-sm transition shadow-lg">
              INICIAR SESIÓN
            </button>
            <button className="lg:hidden p-2 rounded-md text-yellow-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="bg-black/95 border-t border-yellow-500/30 backdrop-blur">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2.5 rounded-lg font-black shadow-lg" onClick={() => { setIsRegisterModalOpen(true); setIsMobileMenuOpen(false); }}>
                REGISTRARSE
              </button>
              <button className="w-full border-2 border-yellow-400 text-yellow-400 py-2.5 rounded-lg font-bold" onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }}>
                INICIAR SESIÓN
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero visual y CTA */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-black via-red-950 to-black">
        {/* Efecto de brillo de casino */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.h2 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
              ¡APUESTA FÁCIL, GANA RÁPIDO!
            </motion.h2>
            <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-semibold">
              Regístrate y recibe un <span className="text-yellow-400 font-black">BONO DEL 100%</span>. Vive la emoción de las apuestas deportivas.
            </motion.p>
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
              <button onClick={() => setIsRegisterModalOpen(true)} className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:to-yellow-600 text-black px-12 py-5 rounded-xl font-black text-xl shadow-2xl shadow-yellow-500/50 transition transform hover:scale-105 animate-pulse">
                <span className="relative z-10">COMENZAR AHORA</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-xl"></div>
              </button>
            </motion.div>
          </div>

          {/* Features organizadas horizontalmente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, idx) => (
              <motion.div key={idx} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3 + idx*0.1}} className="bg-gradient-to-br from-gray-900 to-black border border-red-700/30 rounded-2xl shadow-2xl p-6 text-center hover:shadow-red-500/30 hover:border-red-500/50 transition transform hover:-translate-y-2 backdrop-blur">
                <div className="mb-4 flex justify-center">{f.icon}</div>
                <h4 className="font-black mb-2 text-lg text-yellow-400 uppercase tracking-wide">{f.title}</h4>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios rápidos */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-5xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 uppercase tracking-wider">
            ¿Por qué apostar con 24BET?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, idx) => (
              <motion.div key={idx} initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-500/20 rounded-2xl shadow-xl p-6 text-center hover:shadow-yellow-500/30 hover:border-yellow-500/50 transition transform hover:-translate-y-2 hover:scale-105">
                <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">{b.emoji}</div>
                <h4 className="font-black text-yellow-400 mb-2 text-base uppercase tracking-wide">{b.title}</h4>
                <p className="text-xs text-gray-400">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios y confianza */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-3xl shadow-2xl shadow-red-500/20 p-10 w-full max-w-3xl text-center">
            <h3 className="text-3xl md:text-4xl font-black mb-6 text-yellow-400 uppercase tracking-wide drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              Miles de usuarios confían en 24BET
            </h3>
            <p className="text-gray-300 text-lg md:text-xl mb-8 italic font-medium">
              "La mejor plataforma para apostar, el registro fue súper rápido y el bono de bienvenida me permitió ganar desde el primer día."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-black shadow-lg shadow-red-500/30 border border-red-500/50">
                +50,000 USUARIOS
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-black shadow-lg shadow-yellow-500/30">
                PAGOS INSTANTÁNEOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(234,179,8,0.3),transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,rgba(234,179,8,0.3),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            ¿LISTO PARA GANAR?
          </h3>
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-bold">
            Únete a miles de usuarios que ya están ganando con 24BET. <span className="text-yellow-400">Regístrate en menos de 1 minuto.</span>
          </p>
          <button onClick={() => setIsRegisterModalOpen(true)} className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:to-yellow-600 text-black px-14 py-6 rounded-xl font-black text-2xl shadow-2xl shadow-yellow-500/50 transition transform hover:scale-110 border-4 border-yellow-300">
            <span className="relative z-10">REGISTRARSE AHORA</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-xl"></div>
          </button>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="py-8 border-t border-red-900 bg-black mt-auto">
        <div className="container mx-auto px-4 text-sm text-gray-400 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="font-black text-yellow-400 text-lg">24BET</div>
            <div>© 2024 24BET. Juega responsablemente. +18</div>
          </div>
          <div className="flex space-x-4">
            <button className="text-sm hover:text-yellow-400 transition">Términos</button>
            <button className="text-sm hover:text-yellow-400 transition">Ayuda</button>
            <button className="text-sm hover:text-yellow-400 transition">Contacto</button>
          </div>
        </div>
      </footer>

      {/* CTA fijo inferior */}
      <div className="fixed left-4 right-4 bottom-6 sm:bottom-8 z-50 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl pointer-events-auto bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-2xl p-4 shadow-2xl shadow-red-500/50 flex items-center justify-between border-2 border-yellow-500/50 backdrop-blur">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-2xl animate-bounce shadow-lg shadow-yellow-500/50">
                🎁
              </div>
              <div>
                <div className="font-black text-base text-yellow-400 uppercase tracking-wide">Bono de bienvenida</div>
                <div className="text-xs opacity-90">Regístrate y duplica tu primer depósito</div>
              </div>
            </div>
            <div>
              <button onClick={() => setIsRegisterModalOpen(true)} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-5 py-2.5 rounded-xl font-black transition shadow-lg shadow-yellow-500/50 transform hover:scale-105">
                OBTENER BONO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
      />
    </div>
  );
};

export default LandingPage;
