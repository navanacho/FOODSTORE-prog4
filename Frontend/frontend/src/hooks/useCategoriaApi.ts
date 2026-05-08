// src/pages/categorias/useCategoriaApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Categoria } from '../types'

// Tipo auxiliar: ID requerido + resto opcional para actualizaciones
type UpdateCategoriaInput = { id: number } & Partial<Omit<Categoria, 'id' | 'created_at'>>

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await api.get<Categoria[]>('/categorias')
      return data
    }
  })
}

export const useCreateCategoria = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Categoria>) => {
      const res = await api.post<Categoria>('/categorias', data)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] })
  })
}

export const useUpdateCategoria = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateCategoriaInput) => {
      const { id, ...payload } = data
      const res = await api.put<Categoria>(`/categorias/${id}`, payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] })
  })
}

export const useDeleteCategoria = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => await api.delete(`/categorias/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] })
  })
}