import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layout principal
const App = lazy(() => import('../App'))

// Páginas de módulos (lazy loading para code splitting)
const LandingPage = lazy(() => import('../pages/LandingPage'))
const CategoriasPage = lazy(() => import('../pages/categorias/CategoriasPage'))
const ProductosPage = lazy(() => import('../pages/productos/ProductosPage'))
const IngredientesPage = lazy(() => import('../pages/ingredientes/IngredientesPage'))
//const DetallePage = lazy(() => import('../pages/detalle/DetallePage'))

// Fallback de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    <span className="ml-3 text-white/60">Cargando...</span>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    ),
    children: [
      { index: true, element: <LandingPage /> }, // Home por defecto
      { path: 'categorias', element: <CategoriasPage /> },
      { path: 'productos', element: <ProductosPage /> },
      { path: 'ingredientes', element: <IngredientesPage /> },
      //{ path: 'detalle/:entity/:id', element: <DetallePage /> },
      // 404
      { path: '*', element: <div className="p-8 text-center text-gray-500">404 - Página no encontrada</div> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}