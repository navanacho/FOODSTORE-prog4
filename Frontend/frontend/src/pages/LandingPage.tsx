import { ArrowUpRight, Zap, Star, Shield, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-visible min-h-[900px] flex items-center justify-center pt-[150px]">
        {/* Background gradient instead of video */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />
        <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="liquid-glass rounded-full px-1 py-1 flex items-center gap-2 mb-8 animate-fade-in-up">
            <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-bold">Premium</span>
            <span className="text-sm font-medium text-white/90 pr-3">Tu comida favorita a un clic de distancia.</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-[6rem] font-heading italic text-white leading-[0.8] tracking-[-2px] md:tracking-[-4px] max-w-4xl mb-6">
            La Experiencia FoodStore
          </h1>
          
          <p className="text-sm md:text-lg text-white/70 font-body font-light leading-relaxed max-w-2xl mb-12">
            Sabores increíbles. Ingredientes frescos. Una experiencia de pedido rediseñada para ti. 
            Disfruta de la mejor calidad desde la comodidad de tu hogar.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <NavLink to="/productos" className="liquid-glass-strong rounded-full px-6 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
              Explorar Productos <ArrowUpRight className="w-5 h-5" />
            </NavLink>
            <NavLink to="/categorias" className="rounded-full px-6 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
              Ver Categorías <ChevronRight className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="liquid-glass rounded-3xl p-12 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic mb-2">500+</div>
                <div className="text-white/60 font-body font-light text-sm">Pedidos diarios</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic mb-2">99%</div>
                <div className="text-white/60 font-body font-light text-sm">Clientes Satisfechos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic mb-2">30m</div>
                <div className="text-white/60 font-body font-light text-sm">Tiempo promedio</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic mb-2">50+</div>
                <div className="text-white/60 font-body font-light text-sm">Variedades únicas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="liquid-glass rounded-full px-4 py-1 text-xs font-medium text-white font-body mb-6">
              Por qué elegirnos
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
              La diferencia está en los detalles.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="liquid-glass rounded-2xl p-8">
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Preparación Rápida</h3>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed">
                Tu pedido listo en minutos, con la misma calidad de siempre. Porque esperar por buena comida no debería ser una opción.
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-8">
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Calidad Premium</h3>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed">
                Seleccionamos cuidadosamente cada ingrediente. Diseño preciso en cada platillo para que cada bocado sea inolvidable.
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-8">
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pago Seguro</h3>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed">
                Transacciones protegidas con estándares empresariales. Disfruta de tu pedido con total tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic leading-[0.85] mb-6">
            Tu próximo pedido empieza aquí.
          </h2>
          <p className="text-white/60 font-body font-light text-sm md:text-base mb-10 max-w-2xl mx-auto">
            Explora nuestro menú y descubre por qué somos la opción favorita de miles de clientes.
          </p>
          <div className="flex justify-center gap-4">
            <NavLink to="/productos" className="liquid-glass-strong rounded-full px-8 py-4 text-base font-medium hover:bg-white/5 transition-colors">
              Hacer Pedido Ahora
            </NavLink>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
          <p>&copy; 2026 FoodStore Premium. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
