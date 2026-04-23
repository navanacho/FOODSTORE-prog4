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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">🍔 Gestión de Productos</h1>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Nombre</th>
              <th className="p-4 font-semibold text-gray-700">Precio</th>
              <th className="p-4 font-semibold text-gray-700">Tiempo</th>
              <th className="p-4 font-semibold text-gray-700">Estado</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No hay productos registrados</td></tr>
            ) : (
              data.map(prod => (
                <tr key={prod.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">{prod.id}</td>
                  <td className="p-4 font-medium">{prod.nombre}</td>
                  <td className="p-4 text-green-700 font-semibold">${prod.precio_base.toFixed(2)}</td>
                  <td className="p-4">{prod.tiempo_prep_min ? `${prod.tiempo_prep_min} min` : '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${prod.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {prod.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
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