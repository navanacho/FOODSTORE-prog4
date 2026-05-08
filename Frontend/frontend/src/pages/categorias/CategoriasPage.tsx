import { useState } from 'react'
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../../hooks/useCategoriaApi'
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-heading italic tracking-tight">Gestión de Categorías</h1>
        <button onClick={handleCreate} className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
          + Nueva Categoría
        </button>
      </div>

      <div className="liquid-glass rounded-xl overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="p-4 font-semibold text-white/80">ID</th>
              <th className="p-4 font-semibold text-white/80">Nombre</th>
              <th className="p-4 font-semibold text-white/80">Descripción</th>
              <th className="p-4 font-semibold text-white/80">Orden</th>
              <th className="p-4 font-semibold text-white/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-white/50">No hay categorías registradas</td></tr>
            ) : (
              data.map((cat: Categoria) => (
                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-white/60">{cat.id}</td>
                  <td className="p-4 font-medium text-white">{cat.nombre}</td>
                  <td className="p-4 text-white/60 truncate max-w-[200px]">{cat.descripcion || '-'}</td>
                  <td className="p-4 text-white/80">{cat.orden_display}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(cat)} className="text-white hover:text-white/70 font-medium transition">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 font-medium transition">Eliminar</button>
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