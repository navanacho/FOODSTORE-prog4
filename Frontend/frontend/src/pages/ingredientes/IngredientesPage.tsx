import { useState } from 'react'
import { useIngredientes, useCreateIngrediente, useUpdateIngrediente, useDeleteIngrediente } from '../../hooks/useIngredienteApi'
import IngredienteFormModal from './IngredienteFormModal'
import type { Ingrediente } from '../../types'

export default function IngredientesPage() {
  const { data = [], isLoading, isError } = useIngredientes()
  const create = useCreateIngrediente()
  const update = useUpdateIngrediente()
  const del = useDeleteIngrediente()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Ingrediente | null>(null)

  const handleCreate = () => { setEditing(null); setModalOpen(true) }
  const handleEdit = (ing: Ingrediente) => { setEditing(ing); setModalOpen(true) }
  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar ingrediente?')) del.mutate(id)
  }

  const handleSubmit = (formData: Partial<Ingrediente>) => {
    if (editing) {
      update.mutate({ ...formData, id: editing.id }, { onSuccess: () => setModalOpen(false) })
    } else {
      create.mutate(formData, { onSuccess: () => setModalOpen(false) })
    }
  }

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Cargando ingredientes...</div>
  if (isError) return <div className="text-center py-12 text-red-500">❌ Error al conectar con el servidor</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-heading italic tracking-tight">Gestión de Ingredientes</h1>
        <button onClick={handleCreate} className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
          + Nuevo Ingrediente
        </button>
      </div>

      <div className="liquid-glass rounded-xl overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="p-4 font-semibold text-white/80">ID</th>
              <th className="p-4 font-semibold text-white/80">Nombre</th>
              <th className="p-4 font-semibold text-white/80">Alérgeno</th>
              <th className="p-4 font-semibold text-white/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-white/50">No hay ingredientes registrados</td></tr>
            ) : (
              data.map((ing: Ingrediente) => (
                <tr key={ing.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-white/60">{ing.id}</td>
                  <td className="p-4 font-medium text-white">{ing.nombre}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${ing.es_alergeno ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-white/60'}`}>
                      {ing.es_alergeno ? '⚠️ Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(ing)} className="text-white hover:text-white/70 font-medium transition">Editar</button>
                    <button onClick={() => handleDelete(ing.id)} className="text-red-400 hover:text-red-300 font-medium transition">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <IngredienteFormModal
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit} initialData={editing}
        isSubmitting={create.isPending || update.isPending}
      />
    </div>
  )
}