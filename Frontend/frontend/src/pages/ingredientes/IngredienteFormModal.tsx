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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="liquid-glass rounded-2xl w-full max-w-md p-6 relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading italic tracking-tight text-white mb-6">
            {initialData ? 'Editar' : 'Nuevo'} Ingrediente
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Nombre *</label>
              <input required maxLength={100} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="es_alergeno" className="w-4 h-4 rounded bg-white/5 border-white/10"
                checked={form.es_alergeno ?? false} onChange={e => setForm({ ...form, es_alergeno: e.target.checked })} />
              <label htmlFor="es_alergeno" className="text-sm font-medium text-white/80">¿Es Alérgeno?</label>
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