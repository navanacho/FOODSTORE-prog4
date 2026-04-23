import { useState, useEffect } from 'react'
import type { Ingrediente } from '../../types'

interface IngredienteFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Ingrediente>) => void
  initialData?: Ingrediente | null
  isSubmitting: boolean
}

export default function IngredienteFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: IngredienteFormModalProps) {
  const [form, setForm] = useState<Partial<Ingrediente>>({ nombre: '', es_alergeno: false })

  useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({ nombre: '', es_alergeno: false })
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar' : 'Nuevo'} Ingrediente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input required maxLength={100} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="es_alergeno" className="w-4 h-4"
              checked={form.es_alergeno ?? false} onChange={e => setForm({ ...form, es_alergeno: e.target.checked })} />
            <label htmlFor="es_alergeno" className="text-sm font-medium">¿Es Alérgeno?</label>
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