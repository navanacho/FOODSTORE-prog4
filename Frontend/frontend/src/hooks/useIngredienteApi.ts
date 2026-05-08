import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Ingrediente } from '../types'

type UpdateIngredienteInput = { id: number } & Partial<Omit<Ingrediente, 'id'>>

export const useIngredientes = () => {
  return useQuery({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data } = await api.get<Ingrediente[]>('/ingredientes')
      return data
    }
  })
}

export const useCreateIngrediente = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Ingrediente>) => {
      const res = await api.post<Ingrediente>('/ingredientes', data)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredientes'] })
  })
}

export const useUpdateIngrediente = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateIngredienteInput) => {
      const { id, ...payload } = data
      const res = await api.put<Ingrediente>(`/ingredientes/${id}`, payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredientes'] })
  })
}

export const useDeleteIngrediente = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => await api.delete(`/ingredientes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredientes'] })
  })
}