import { useState } from 'react';
import { motion } from 'framer-motion';
import RegisterModal from '../components/modal/RegisterModal';
import LoginModal from '../components/modal/LoginModal';
import { MenuIcon, CloseIcon, LightningIcon, TrophyIcon, SecurityIcon, DiceIcon } from '../components/Icons';
import logo24bet from '../assets/24bet.png';
import logo24betr from '../assets/24betr.png';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Contenido de la landing (sin emojis, solo paleta blanco/rojos/grises)
  const features = [
    {
      icon: <LightningIcon size={28} className="text-red-600" />,
      title: 'Registro en segundos',
      desc: 'Crea tu cuenta y empieza a jugar sin fricción.'
    },
    {
      icon: <TrophyIcon size={28} className="text-red-600" />,
      title: 'Apuestas en vivo',
      desc: 'Acción en tiempo real con desempeño ágil.'
    },
    {
      icon: <SecurityIcon size={28} className="text-red-600" />,
      title: 'Pagos rápidos',
      desc: 'Depósitos y retiros con confirmación veloz.'
    }
  ];

  const steps = [
    { title: '1. Regístrate', desc: 'Completa un formulario simple y seguro.' },
    { title: '2. Deposita', desc: 'Carga saldo y obtén promociones disponibles.' },
    { title: '3. Apuesta', desc: 'Elige tu evento y confirma tu ticket.' },
    { title: '4. Retira', desc: 'Recibe tus ganancias de forma ágil.' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header rojo */}
      <header className="sticky top-0 z-50 bg-red-700/95 backdrop-blur border-b border-red-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <img src={logo24bet} alt="24BET" className="h-15 object-contain item-center" />
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsLoginModalOpen(true)} className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 font-medium transition">
              Iniciar sesión
            </button>
            <button onClick={() => setIsRegisterModalOpen(true)} className="px-4 py-2 rounded-lg bg-white text-red-700 hover:bg-gray-100 font-semibold shadow-sm transition">
              Crear cuenta
            </button>
            <button className="lg:hidden p-2 rounded-md text-white border border-white/30" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="bg-red-700 border-t border-red-800">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <button className="w-full bg-white text-red-700 hover:bg-gray-100 py-2.5 rounded-lg font-semibold shadow-sm" onClick={() => { setIsRegisterModalOpen(true); setIsMobileMenuOpen(false); }}>
                Crear cuenta
              </button>
              <button className="w-full border border-white/30 text-white py-2.5 rounded-lg font-medium hover:bg-white/10" onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }}>
                Iniciar sesión
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 pt-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-12">
            {/* Logo centrado en el hero */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center justify-center ">
                <img src={logo24betr} alt="24BET" className="h-30 w-auto object-contain" />
              </div>
            </div>
            <motion.h2 initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Apuesta con estilo, gana con velocidad
            </motion.h2>
            <motion.p initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-lg md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Vive la emoción con una experiencia limpia, estética y potente.
            </motion.p>
            <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="flex items-center justify-center gap-3">
              <button onClick={() => setIsRegisterModalOpen(true)} className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition">
                Crear cuenta
              </button>
              <button onClick={() => setIsLoginModalOpen(true)} className="px-8 py-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-semibold transition">
                Iniciar sesión
              </button>
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{opacity:0, y:16}}
                whileInView={{opacity:1, y:0}}
                viewport={{once:true}}
                transition={{delay:0.1 * idx}}
                className="rounded-2xl border border-red-100 bg-white p-6 text-center hover:shadow-md transition"
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                  {f.icon}
                </div>
                <h4 className="font-bold mb-2 text-lg text-gray-900">{f.title}</h4>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
            ¿Cómo funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((s, idx) => (
              <motion.div key={idx} initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="rounded-2xl border border-red-100 bg-gray-50 p-6 text-center">
                <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h4 className="font-bold mb-1 text-gray-900">{s.title}</h4>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banda de cifras */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[{k:'+50K', v:'Usuarios'}, {k:'24/7', v:'Soporte'}, {k:'ms', v:'Latencia baja'}, {k:'100%', v:'Seguro'}].map((i, idx) => (
              <div key={idx} className="rounded-xl border border-red-100 bg-white py-6">
                <div className="text-3xl font-extrabold text-red-700">{i.k}</div>
                <div className="text-sm text-gray-600">{i.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-red-700">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            ¿Listo para empezar?
          </h3>
          <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Únete y disfruta de una experiencia estética y rápida.
          </p>
          <button onClick={() => setIsRegisterModalOpen(true)} className="px-12 py-5 rounded-xl bg-white text-red-700 hover:bg-gray-100 font-extrabold text-xl shadow-sm transition">
            Crear cuenta ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white mt-auto">
        <div className="container mx-auto px-4 text-sm text-gray-600 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="font-extrabold text-gray-900 text-lg">24BET</div>
            <div>© 2024 24BET. Juega responsablemente. +18</div>
          </div>
          <div className="flex space-x-4">
            <button className="text-sm hover:text-gray-900 transition">Términos</button>
            <button className="text-sm hover:text-gray-900 transition">Ayuda</button>
            <button className="text-sm hover:text-gray-900 transition">Contacto</button>
          </div>
        </div>
      </footer>

      {/* Barra fija inferior */}
      <div className="fixed left-4 right-4 bottom-6 sm:bottom-8 z-50 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl pointer-events-auto bg-white text-gray-900 rounded-2xl p-4 shadow-xl flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                <DiceIcon size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">Comienza hoy</div>
                <div className="text-xs text-gray-600">Crea tu cuenta en segundos</div>
              </div>
            </div>
            <div>
              <button onClick={() => setIsRegisterModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition">
                Crear cuenta
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
