import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { Producto } from '../../types'

type UpdateProductoInput = { id: number } & Partial<Omit<Producto, 'id' | 'created_at'>>

export const useProductos = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await api.get<Producto[]>('/productos')
      return data
    }
  })
}

export const useCreateProducto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Producto>) => {
      const res = await api.post<Producto>('/productos', data)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] })
  })
}

export const useUpdateProducto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateProductoInput) => {
      const { id, ...payload } = data
      const res = await api.put<Producto>(`/productos/${id}`, payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] })
  })
}

export const useDeleteProducto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => await api.delete(`/productos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] })
  })
}