import { useState, useEffect } from 'react'
import type { Producto } from '../../types'

interface ProductoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Producto>) => void
  initialData?: Producto | null
  isSubmitting: boolean
}

export default function ProductoFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ProductoFormModalProps) {
  const [form, setForm] = useState<Partial<Producto>>({
    nombre: '', descripcion: '', precio_base: 0, tiempo_prep_min: 0, disponible: true, imagenes_url: []
  })

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, imagenes_url: initialData.imagenes_url || [] })
    } else {
      setForm({ nombre: '', descripcion: '', precio_base: 0, tiempo_prep_min: 0, disponible: true, imagenes_url: [] })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar' : 'Nuevo'} Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input required maxLength={150} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Precio Base *</label>
              <input type="number" step="0.01" min="0" required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.precio_base ?? 0} onChange={e => setForm({ ...form, precio_base: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tiempo Prep (min)</label>
              <input type="number" min="0" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.tiempo_prep_min ?? ''} onChange={e => setForm({ ...form, tiempo_prep_min: e.target.value ? Number(e.target.value) : null })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="disponible" className="w-4 h-4"
              checked={form.disponible ?? true} onChange={e => setForm({ ...form, disponible: e.target.checked })} />
            <label htmlFor="disponible" className="text-sm font-medium">Disponible</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}