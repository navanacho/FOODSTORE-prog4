import { useState, useEffect } from 'react'
import type { Producto, Categoria, Ingrediente } from '../../types'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

interface ProductoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Producto & { categoria_ids?: number[], ingrediente_ids?: number[] }>) => void
  initialData?: Producto | null
  isSubmitting: boolean
}

export default function ProductoFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ProductoFormModalProps) {
  const [form, setForm] = useState<Partial<Producto & { categoria_ids?: number[], ingrediente_ids?: number[] }>>({
    nombre: '', descripcion: '', precio_base: 0, tiempo_prep_min: 0, disponible: true, imagenes_url: [], categoria_ids: [], ingrediente_ids: []
  })

  // Fetch listas disponibles
  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: () => api.get<Categoria[]>('/categorias').then(r => r.data) })
  const { data: ingredientes = [] } = useQuery({ queryKey: ['ingredientes'], queryFn: () => api.get<Ingrediente[]>('/ingredientes').then(r => r.data) })

 useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Nota: en producción idealmente el backend retornaría los IDs relacionados
        // Para el parcial, asumimos que creas desde 0 o pasas IDs manualmente
        setForm({ ...initialData, categoria_ids: [], ingrediente_ids: [] })
      } else {
        setForm({ nombre: '', descripcion: '', precio_base: 0, tiempo_prep_min: 0, disponible: true, imagenes_url: [], categoria_ids: [], ingrediente_ids: [] })
      }
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const toggleSelection = (type: 'categoria_ids' | 'ingrediente_ids', id: number) => {
    setForm(prev => {
      const current = prev[type] || []
      return { ...prev, [type]: current.includes(id) ? current.filter(i => i !== id) : [...current, id] }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="liquid-glass rounded-2xl w-full max-w-lg p-6 relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading italic tracking-tight text-white mb-6">
            {initialData ? 'Editar' : 'Nuevo'} Producto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Nombre *</label>
              <input required maxLength={150} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Descripción</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Precio Base *</label>
                <input type="number" step="0.01" min="0" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                  value={form.precio_base ?? 0} onChange={e => setForm({ ...form, precio_base: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Tiempo Prep (min)</label>
                <input type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                  value={form.tiempo_prep_min ?? ''} onChange={e => setForm({ ...form, tiempo_prep_min: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="disponible" className="w-4 h-4 rounded bg-white/5 border-white/10"
                checked={form.disponible ?? true} onChange={e => setForm({ ...form, disponible: e.target.checked })} />
              <label htmlFor="disponible" className="text-sm font-medium text-white/80">Disponible</label>
            </div>
            {/*SELECTOR CATEGORÍAS (N:M) */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Categorías</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                {categorias.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
                    <input type="checkbox" checked={(form.categoria_ids || []).includes(cat.id)} onChange={() => toggleSelection('categoria_ids', cat.id)} className="rounded" />
                    <span className="text-sm">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            {/*SELECTOR INGREDIENTES (N:M) */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Ingredientes</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                {ingredientes.map(ing => (
                  <label key={ing.id} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
                    <input type="checkbox" checked={(form.ingrediente_ids || []).includes(ing.id)} onChange={() => toggleSelection('ingrediente_ids', ing.id)} className="rounded" />
                    <span className="text-sm">{ing.nombre} {ing.es_alergeno && '⚠️'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6">
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium rounded-full text-white/70 hover:text-white hover:bg-white/5 transition">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="liquid-glass-strong rounded-full px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}