import { useState, useEffect } from 'react'
import type { Categoria } from '../../types'

interface CategoriaFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Categoria>) => void
  initialData?: Categoria | null
  isSubmitting: boolean
}

export default function CategoriaFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: CategoriaFormModalProps) {
  const [form, setForm] = useState<Partial<Categoria>>({ nombre: '', descripcion: '', orden_display: 0, parent_id: null })

  useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({ nombre: '', descripcion: '', orden_display: 0, parent_id: null })
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar' : 'Nueva'} Categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input required maxLength={100} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input type="number" min="0" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.orden_display ?? 0} onChange={e => setForm({ ...form, orden_display: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parent ID</label>
              <input type="number" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.parent_id ?? ''} onChange={e => setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : null })} />
            </div>
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