import { useState } from 'react'
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from './useCategoriaApi'
import CategoriaFormModal from './CategoriaFormModal'
import type { Categoria } from '../../types'

export default function CategoriasPage() {
  const { data = [], isLoading, isError } = useCategorias()
  const create = useCreateCategoria()
  const update = useUpdateCategoria()
  const del = useDeleteCategoria()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)

  const handleCreate = () => { setEditing(null); setModalOpen(true) }
  const handleEdit = (cat: Categoria) => { setEditing(cat); setModalOpen(true) }
  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar categoría? Esta acción aplica Soft-Delete.')) del.mutate(id)
  }

  const handleSubmit = async (formData: Partial<Categoria>) => {
    if (editing) {
      update.mutate({ ...formData, id: editing.id }, { onSuccess: () => setModalOpen(false) })
    } else {
      create.mutate(formData, { onSuccess: () => setModalOpen(false) })
    }
  }

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Cargando categorías...</div>
  if (isError) return <div className="text-center py-12 text-red-500">❌ Error al conectar con el servidor</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">📦 Gestión de Categorías</h1>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Nombre</th>
              <th className="p-4 font-semibold text-gray-700">Descripción</th>
              <th className="p-4 font-semibold text-gray-700">Orden</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No hay categorías registradas</td></tr>
            ) : (
              data.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">{cat.id}</td>
                  <td className="p-4 font-medium">{cat.nombre}</td>
                  <td className="p-4 text-gray-600 truncate max-w-[200px]">{cat.descripcion || '-'}</td>
                  <td className="p-4">{cat.orden_display}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoriaFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
        isSubmitting={create.isPending || update.isPending}
      />
    </div>
  )
}