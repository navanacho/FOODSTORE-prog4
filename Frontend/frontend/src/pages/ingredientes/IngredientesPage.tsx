import { useState } from 'react'
import { useIngredientes, useCreateIngrediente, useUpdateIngrediente, useDeleteIngrediente } from './useIngredienteApi'
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">🌿 Gestión de Ingredientes</h1>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Nuevo Ingrediente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Nombre</th>
              <th className="p-4 font-semibold text-gray-700">Alérgeno</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-500">No hay ingredientes registrados</td></tr>
            ) : (
              data.map(ing => (
                <tr key={ing.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">{ing.id}</td>
                  <td className="p-4 font-medium">{ing.nombre}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${ing.es_alergeno ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                      {ing.es_alergeno ? '⚠️ Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(ing)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                    <button onClick={() => handleDelete(ing.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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