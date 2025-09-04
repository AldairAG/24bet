import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DiceIcon,
    CardsIcon,
    SpadesIcon,
    SlotMachineIcon,
    SoccerIcon,
    TargetIcon,
    SecurityIcon,
    LightningIcon,
    Clock24Icon,
    TrophyIcon,
    GiftIcon,
    StarIcon,
    RocketIcon,
    ChipIcon
} from '../components/Icons';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const games = [
        { name: 'Ruleta', icon: DiceIcon, desc: 'Apuesta y gana en la ruleta clásica', color: 'text-red-500' },
        { name: 'Blackjack', icon: CardsIcon, desc: 'El juego de cartas más emocionante', color: 'text-blue-500' },
        { name: 'Poker', icon: SpadesIcon, desc: 'Texas Hold\'em y más variantes', color: 'text-purple-500' },
        { name: 'Slots', icon: SlotMachineIcon, desc: 'Miles de máquinas tragamonedas', color: 'text-yellow-500' },
        { name: 'Deportes', icon: SoccerIcon, desc: 'Apuestas deportivas en vivo', color: 'text-green-500' },
        { name: 'Dados', icon: TargetIcon, desc: 'Craps y juegos de dados', color: 'text-orange-500' }
    ];

    const promos = [
        { title: 'Bono de Bienvenida', amount: '100%', desc: 'Hasta $500 en tu primer depósito' },
        { title: 'Giros Gratis', amount: '50', desc: 'En máquinas tragamonedas seleccionadas' },
        { title: 'Cashback', amount: '10%', desc: 'Devolución semanal en pérdidas' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background with gradient */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div 
                        className="absolute inset-0"
                        animate={{
                            background: [
                                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)"
                            ],
                            backgroundPosition: ["-200% 0", "200% 0"]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ backgroundSize: "200% 100%" }}
                    />
                </motion.div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 z-20"></div>
                
                {/* Content */}
                <motion.div 
                    className="relative z-30 text-center max-w-4xl px-5"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <motion.h1 className="mb-8">
                        <motion.span 
                            className="block text-6xl md:text-8xl font-black tracking-[0.3em] text-transparent bg-gradient-to-r from-white to-red-300 bg-clip-text mb-3"
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(239, 68, 68, 0.5)",
                                    "0 0 30px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)",
                                    "0 0 20px rgba(239, 68, 68, 0.5)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            24BET
                        </motion.span>
                        <motion.span 
                            className="block text-xl md:text-3xl font-light tracking-[0.2em] text-red-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            CASINO
                        </motion.span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-lg md:text-xl mb-10 text-gray-100 leading-relaxed max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        El casino online más emocionante. Juega, apuesta y gana las 24 horas del día.
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                    >
                        <motion.button 
                            className="group bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wide shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                            whileHover={{ 
                                scale: 1.05, 
                                y: -5,
                                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <SlotMachineIcon size={24} />
                            </motion.div>
                            JUGAR AHORA
                        </motion.button>
                        <motion.button 
                            className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wide transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                            whileHover={{ 
                                scale: 1.05, 
                                y: -5,
                                backgroundColor: "white",
                                color: "#dc2626"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GiftIcon size={24} />
                            </motion.div>
                            VER BONOS
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Floating Chips */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <motion.div 
                        className="absolute top-1/5 left-1/10"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <ChipIcon size={48} className="text-red-500 drop-shadow-lg" />
                    </motion.div>
                    <motion.div 
                        className="absolute top-3/5 right-1/6"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    >
                        <ChipIcon size={48} className="text-white drop-shadow-lg" />
                    </motion.div>
                    <motion.div 
                        className="absolute bottom-1/3 left-1/5"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 4
                        }}
                    >
                        <ChipIcon size={48} className="text-red-500 drop-shadow-lg" />
                    </motion.div>
                    <motion.div 
                        className="absolute top-2/5 right-1/3"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 6
                        }}
                    >
                        <ChipIcon size={48} className="text-white drop-shadow-lg" />
                    </motion.div>
                </div>
            </section>

            {/* Games Section */}
            <motion.section 
                className="py-20 bg-gradient-to-br from-gray-800 to-gray-900"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-6xl mx-auto px-5">
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white flex items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <DiceIcon size={48} className="text-red-500" />
                        </motion.div>
                        NUESTROS JUEGOS
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game, index) => {
                            const IconComponent = game.icon;
                            return (
                                <motion.div 
                                    key={index} 
                                    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-8 text-center transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.02,
                                        borderColor: "#ef4444",
                                        borderWidth: 2,
                                        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)"
                                    }}
                                >
                                    <motion.div 
                                        className={`mb-5 flex justify-center ${game.color}`}
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <IconComponent size={60} />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">
                                        {game.name}
                                    </h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        {game.desc}
                                    </p>
                                    <motion.button 
                                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg"
                                        whileHover={{ 
                                            scale: 1.1,
                                            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Jugar
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* Promotions Carousel */}
            <motion.section 
                className="py-20 bg-gradient-to-br from-red-600 to-red-800 relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto px-5 relative z-10">
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white flex items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <GiftIcon size={48} className="text-yellow-300" />
                        </motion.div>
                        PROMOCIONES EXCLUSIVAS
                    </motion.h2>
                    
                    <motion.div 
                        className="bg-white/95 rounded-2xl p-12 text-gray-800 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        key={currentSlide}
                    >
                        <motion.div 
                            className="text-6xl font-black text-red-600 mb-5"
                            animate={{ 
                                scale: [1, 1.1, 1],
                                color: ["#dc2626", "#ef4444", "#dc2626"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {promos[currentSlide].amount}
                        </motion.div>
                        <motion.h3 
                            className="text-3xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {promos[currentSlide].title}
                        </motion.h3>
                        <motion.p 
                            className="text-lg mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {promos[currentSlide].desc}
                        </motion.p>
                        <motion.button 
                            className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 px-8 rounded-full"
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Reclamar
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                className="py-20 bg-gradient-to-br from-gray-900 to-black"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-6xl mx-auto px-5">
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white flex items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <StarIcon size={48} className="text-yellow-400" />
                        </motion.div>
                        ¿POR QUÉ ELEGIR 24BET?
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: SecurityIcon, title: '100% Seguro', desc: 'Licenciado y regulado. Tus datos y dinero están protegidos.', color: 'text-green-400' },
                            { icon: LightningIcon, title: 'Pagos Rápidos', desc: 'Retiros instantáneos. Deposita y retira cuando quieras.', color: 'text-blue-400' },
                            { icon: Clock24Icon, title: '24/7 Disponible', desc: 'Juega cualquier día, cualquier hora. Nunca cerramos.', color: 'text-purple-400' },
                            { icon: TrophyIcon, title: 'Premios Grandes', desc: 'Jackpots millonarios y premios que cambian vidas.', color: 'text-yellow-400' }
                        ].map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div 
                                    key={index}
                                    className="text-center p-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-3 hover:border-2 hover:border-red-500 hover:shadow-2xl group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.02,
                                        borderColor: "#ef4444",
                                        borderWidth: 2,
                                        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)"
                                    }}
                                >
                                    <motion.div 
                                        className={`mb-5 flex justify-center ${feature.color}`}
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <IconComponent size={60} />
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-4 text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-center relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto px-5 relative z-10">
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold mb-5"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        ¿LISTO PARA GANAR?
                    </motion.h2>
                    <motion.p 
                        className="text-xl mb-12 opacity-90"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Únete a miles de jugadores que ya están ganando en 24Bet
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-16 mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {[
                            { number: '50K+', label: 'Jugadores' },
                            { number: '$2M+', label: 'Pagado' },
                            { number: '99%', label: 'Satisfacción' }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index} 
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                            >
                                <motion.span 
                                    className="block text-4xl md:text-5xl font-black text-white mb-2"
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        textShadow: [
                                            "0 0 5px rgba(255, 255, 255, 0.5)",
                                            "0 0 15px rgba(255, 255, 255, 0.8)",
                                            "0 0 5px rgba(255, 255, 255, 0.5)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {stat.number}
                                </motion.span>
                                <span className="block text-lg opacity-80">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <motion.button 
                        className="group bg-white text-red-600 font-black py-5 px-10 text-xl rounded-full uppercase tracking-wide transition-all duration-300 hover:transform hover:-translate-y-1 shadow-2xl hover:shadow-2xl flex items-center gap-3 mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 1 }}
                        whileHover={{ 
                            scale: 1.05,
                            y: -5,
                            boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ 
                                y: [0, -5, 0],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <RocketIcon size={24} />
                        </motion.div>
                        EMPEZAR A JUGAR GRATIS
                    </motion.button>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t-2 border-red-600">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-2xl font-bold text-red-500 mb-3">24BET</h3>
                            <p className="text-gray-400">Tu casino de confianza</p>
                        </div>
                        
                        <div className="flex justify-center gap-8 flex-wrap">
                            {['Juegos', 'Promociones', 'Soporte', 'Términos'].map((link, index) => (
                                <a key={index} href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                                    {link}
                                </a>
                            ))}
                        </div>
                        
                        <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                            <SecurityIcon size={16} />
                            <span>Solo para mayores de 18 años. Juega responsablemente.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
