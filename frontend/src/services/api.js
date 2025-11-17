import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Health check
export const checkHealth = () => api.get('/health')

// Movies
export const getMovies = () => api.get('/movies')
export const getMovieById = (id) => api.get(`/movies/${id}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)

// Profiles
export const getProfiles = () => api.get('/profiles')
export const getProfileById = (id) => api.get(`/profiles/${id}`)
export const createProfile = (data) => api.post('/profiles', data)
export const updateProfile = (id, data) => api.put(`/profiles/${id}`, data)

export default api

