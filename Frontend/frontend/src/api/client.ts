import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para logging (útil para debug en el video)
api.interceptors.request.use((config) => {
  console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`)
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`📥 [${response.status}] ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} - ${error.message}`)
    return Promise.reject(error)
  }
)

// Helpers tipados para usar en los hooks
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const { data } = await api.get<T>(url, config)
  return data
}

export const apiPost = async <T, D = any>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.post<T>(url, data, config)
  return response.data
}

export const apiPut = async <T, D = any>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.put<T>(url, data, config)
  return response.data
}

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<T>(url, config)
  return response.data
}