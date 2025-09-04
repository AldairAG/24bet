import React, { useState, useEffect } from 'react';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const games = [
        { name: 'Ruleta', icon: '🎲', desc: 'Apuesta y gana en la ruleta clásica' },
        { name: 'Blackjack', icon: '🃏', desc: 'El juego de cartas más emocionante' },
        { name: 'Poker', icon: '♠️', desc: 'Texas Hold\'em y más variantes' },
        { name: 'Slots', icon: '🎰', desc: 'Miles de máquinas tragamonedas' },
        { name: 'Deportes', icon: '⚽', desc: 'Apuestas deportivas en vivo' },
        { name: 'Dados', icon: '🎯', desc: 'Craps y juegos de dados' }
    ];

    const promos = [
        { title: 'Bono de Bienvenida', amount: '100%', desc: 'Hasta $500 en tu primer depósito' },
        { title: 'Giros Gratis', amount: '50', desc: 'En máquinas tragamonedas seleccionadas' },
        { title: 'Cashback', amount: '10%', desc: 'Devolución semanal en pérdidas' }
    ];

    useEffect(() => {
        setIsVisible(true);
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
                <div className="absolute inset-0 bg-casino-gradient z-10">
                    <div className="absolute inset-0 bg-hero-pattern animate-shimmer"></div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 z-20"></div>
                
                {/* Content */}
                <div className={`relative z-30 text-center max-w-4xl px-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <h1 className="mb-8">
                        <span className="block text-6xl md:text-8xl font-black tracking-[0.3em] text-transparent bg-gradient-to-r from-white to-red-300 bg-clip-text animate-glow mb-3">
                            24BET
                        </span>
                        <span className="block text-xl md:text-3xl font-light tracking-[0.2em] text-red-100">
                            CASINO
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl mb-10 text-gray-100 leading-relaxed max-w-2xl mx-auto">
                        El casino online más emocionante. Juega, apuesta y gana las 24 horas del día.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <button className="bg-gradient-to-r from-casino-red-600 to-casino-red-500 hover:from-casino-red-500 hover:to-casino-red-400 text-white font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wide shadow-casino hover:shadow-casino-hover transform hover:-translate-y-1 transition-all duration-300 animate-pulse-glow">
                            🎰 JUGAR AHORA
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-casino-red-600 font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wide transform hover:-translate-y-1 transition-all duration-300">
                            🎁 VER BONOS
                        </button>
                    </div>
                </div>

                {/* Floating Chips */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute top-1/5 left-1/10 text-4xl animate-float" style={{animationDelay: '0s'}}>🔴</div>
                    <div className="absolute top-3/5 right-1/6 text-4xl animate-float" style={{animationDelay: '2s'}}>⚪</div>
                    <div className="absolute bottom-1/3 left-1/5 text-4xl animate-float" style={{animationDelay: '4s'}}>🔴</div>
                    <div className="absolute top-2/5 right-1/3 text-4xl animate-float" style={{animationDelay: '6s'}}>⚪</div>
                </div>
            </section>

            {/* Games Section */}
            <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="max-w-6xl mx-auto px-5">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                        🎲 NUESTROS JUEGOS
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game, index) => (
                            <div 
                                key={index} 
                                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:border-2 hover:border-casino-red-500 hover:shadow-game-card opacity-0 animate-slide-up"
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className="text-5xl mb-5 filter drop-shadow-lg">
                                    {game.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">
                                    {game.name}
                                </h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {game.desc}
                                </p>
                                <button className="bg-gradient-to-r from-casino-red-600 to-casino-red-500 hover:from-casino-red-500 hover:to-casino-red-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105">
                                    Jugar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotions Carousel */}
            <section className="py-20 bg-casino-gradient relative">
                <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full" style={{
                        backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"casino-pattern\" patternUnits=\"userSpaceOnUse\" width=\"50\" height=\"50\"><circle cx=\"25\" cy=\"25\" r=\"3\" fill=\"rgba(255,255,255,0.1)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23casino-pattern)\"/></svg>')"
                    }}></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-5 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                        🎁 PROMOCIONES EXCLUSIVAS
                    </h2>
                    
                    <div className="relative overflow-hidden rounded-2xl">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{transform: `translateX(-${currentSlide * 100}%)`}}
                        >
                            {promos.map((promo, index) => (
                                <div key={index} className="min-w-full px-5">
                                    <div className="bg-white/95 rounded-2xl p-12 text-center text-gray-800 shadow-2xl">
                                        <div className="text-6xl font-black text-casino-red-600 mb-5">
                                            {promo.amount}
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 text-gray-800">
                                            {promo.title}
                                        </h3>
                                        <p className="text-lg mb-8 text-gray-600">
                                            {promo.desc}
                                        </p>
                                        <button className="bg-gradient-to-r from-casino-red-600 to-casino-red-500 hover:from-casino-red-500 hover:to-casino-red-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-casino">
                                            Reclamar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-center gap-3 mt-8">
                            {promos.map((_, index) => (
                                <span 
                                    key={index} 
                                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                        index === currentSlide 
                                            ? 'bg-white scale-125' 
                                            : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                    onClick={() => setCurrentSlide(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
                <div className="max-w-6xl mx-auto px-5">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                        ⭐ ¿POR QUÉ ELEGIR 24BET?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: '🔒', title: '100% Seguro', desc: 'Licenciado y regulado. Tus datos y dinero están protegidos.' },
                            { icon: '⚡', title: 'Pagos Rápidos', desc: 'Retiros instantáneos. Deposita y retira cuando quieras.' },
                            { icon: '🎯', title: '24/7 Disponible', desc: 'Juega cualquier día, cualquier hora. Nunca cerramos.' },
                            { icon: '🏆', title: 'Premios Grandes', desc: 'Jackpots millonarios y premios que cambian vidas.' }
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="text-center p-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-3 hover:border-2 hover:border-casino-red-500 hover:shadow-game-card"
                            >
                                <div className="text-5xl mb-5 filter drop-shadow-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-casino-gradient text-center relative">
                <div className="max-w-4xl mx-auto px-5 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-5">
                        ¿LISTO PARA GANAR?
                    </h2>
                    <p className="text-xl mb-12 opacity-90">
                        Únete a miles de jugadores que ya están ganando en 24Bet
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-16 mb-12">
                        {[
                            { number: '50K+', label: 'Jugadores' },
                            { number: '$2M+', label: 'Pagado' },
                            { number: '99%', label: 'Satisfacción' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <span className="block text-4xl md:text-5xl font-black text-white mb-2">
                                    {stat.number}
                                </span>
                                <span className="block text-lg opacity-80">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <button className="bg-white text-casino-red-600 font-black py-5 px-10 text-xl rounded-full uppercase tracking-wide transition-all duration-300 hover:transform hover:-translate-y-1 shadow-2xl hover:shadow-casino-hover animate-pulse-glow">
                        🚀 EMPEZAR A JUGAR GRATIS
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t-2 border-casino-red-600">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-2xl font-bold text-casino-red-500 mb-3">24BET</h3>
                            <p className="text-gray-400">Tu casino de confianza</p>
                        </div>
                        
                        <div className="flex justify-center gap-8 flex-wrap">
                            {['Juegos', 'Promociones', 'Soporte', 'Términos'].map((link, index) => (
                                <a key={index} href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-casino-red-500 transition-colors duration-300">
                                    {link}
                                </a>
                            ))}
                        </div>
                        
                        <div className="text-gray-500 text-sm">
                            <p>🔞 Solo para mayores de 18 años. Juega responsablemente.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
