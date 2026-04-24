import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/categorias', label: 'Categorías' },
    { to: '/productos', label: 'Productos' },
    { to: '/ingredientes', label: 'Ingredientes' },
  ]

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive 
        ? 'text-white' 
        : 'text-white/70 hover:text-white'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body relative">
      {/* Floating Navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 lg:px-16 pointer-events-none flex justify-center">
        <div className="liquid-glass rounded-full px-1.5 py-1 flex items-center justify-between pointer-events-auto max-w-4xl w-full">
          <div className="flex items-center pl-3">
            <span className="font-heading italic text-xl tracking-tight text-white mr-6">FoodStore</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center pr-1">
            <NavLink to="/productos" className="bg-white text-black rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-white/90 transition-colors">
              Hacer Pedido <ArrowUpRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full ${!isHome ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12' : ''}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isHome && (
        <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40 mt-auto">
          <p>&copy; 2026 FoodStore Premium • Parcial Programación 4</p>
        </footer>
      )}
    </div>
  )
}