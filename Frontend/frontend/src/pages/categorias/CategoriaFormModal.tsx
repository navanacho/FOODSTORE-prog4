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
  if (isOpen) {
    if (initialData) {
      console.log('📝 Editando categoría:', initialData)
      setForm({ ...initialData })
    } else {
      console.log('🆕 Nueva categoría')
      setForm({ nombre: '', descripcion: '', orden_display: 0, parent_id: null })
    }
  }
}, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      parent_id: (form.parent_id === null || form.parent_id === undefined || form.parent_id === 0 || form.parent_id === 0)
        ? null
        : form.parent_id
    }
    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="liquid-glass rounded-2xl w-full max-w-md p-6 relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading italic tracking-tight text-white mb-6">
            {initialData ? 'Editar' : 'Nueva'} Categoría
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Nombre *</label>
              <input required maxLength={100} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Descripción</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Orden</label>
                <input type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition"
                  value={form.orden_display ?? 0} onChange={e => setForm({ ...form, orden_display: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Parent ID (opcional)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-white/20 outline-none transition placeholder-white/30"
                  placeholder="Vacío = raíz"
                  value={form.parent_id ?? ''} 
                  onChange={e => {
                    const val = e.target.value
                    setForm({ 
                      ...form, 
                      parent_id: val === '' ? null : Number(val)
                    })
                  }}
                />
                <p className="text-xs text-white/40 mt-1">
                  Dejar vacío si es principal
                </p>
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