import { useState } from 'react'
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto } from './useProductoApi'
import ProductoFormModal from './ProductoFormModal'
import type { Producto } from '../../types'

export default function ProductosPage() {
  const { data = [], isLoading, isError } = useProductos()
  const create = useCreateProducto()
  const update = useUpdateProducto()
  const del = useDeleteProducto()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)

  const handleCreate = () => { setEditing(null); setModalOpen(true) }
  const handleEdit = (prod: Producto) => { setEditing(prod); setModalOpen(true) }
  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar producto? Se aplicará Soft-Delete.')) del.mutate(id)
  }

  const handleSubmit = (formData: Partial<Producto>) => {
    if (editing) {
      update.mutate({ ...formData, id: editing.id }, { onSuccess: () => setModalOpen(false) })
    } else {
      create.mutate(formData, { onSuccess: () => setModalOpen(false) })
    }
  }

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Cargando productos...</div>
  if (isError) return <div className="text-center py-12 text-red-500">❌ Error al conectar con el servidor</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-heading italic tracking-tight">Gestión de Productos</h1>
        <button onClick={handleCreate} className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
          + Nuevo Producto
        </button>
      </div>

      <div className="liquid-glass rounded-xl overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="p-4 font-semibold text-white/80">ID</th>
              <th className="p-4 font-semibold text-white/80">Nombre</th>
              <th className="p-4 font-semibold text-white/80">Precio</th>
              <th className="p-4 font-semibold text-white/80">Tiempo</th>
              <th className="p-4 font-semibold text-white/80">Estado</th>
              <th className="p-4 font-semibold text-white/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-white/50">No hay productos registrados</td></tr>
            ) : (
              data.map((prod: Producto) => (
                <tr key={prod.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-white/60">{prod.id}</td>
                  <td className="p-4 font-medium text-white">{prod.nombre}</td>
                  <td className="p-4 text-green-400 font-semibold">${prod.precio_base.toFixed(2)}</td>
                  <td className="p-4 text-white/80">{prod.tiempo_prep_min ? `${prod.tiempo_prep_min} min` : '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${prod.disponible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {prod.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(prod)} className="text-white hover:text-white/70 font-medium transition">Editar</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-400 hover:text-red-300 font-medium transition">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductoFormModal
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit} initialData={editing}
        isSubmitting={create.isPending || update.isPending}
      />
    </div>
  )
}