import { NavLink, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  
  const navItems = [
    { to: '/categorias', label: '📦 Categorías' },
    { to: '/productos', label: '🍔 Productos' },
    { to: '/ingredientes', label: '🌿 Ingredientes' },
  ]

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">🍽️ FoodStore</h1>
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {location.pathname.replace('/', '') || 'Inicio'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Outlet />
      </main>

      {/* Footer simple */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>FoodStore API v3.0 • Parcial Programación 4</p>
      </footer>
    </div>
  )
}