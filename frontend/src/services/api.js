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
export const getMovies = (params = {}) => api.get('/movies', { params })
export const getMovieById = (id) => api.get(`/movies/${id}`)
export const createMovie = (data) => api.post('/movies', data)
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`/movies/${id}`)

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password })
export const register = (email, username, password) => api.post('/auth/register', { email, username, password })
export const getMe = () => api.get('/auth/me')

// Profiles
export const getProfiles = () => api.get('/profiles')
export const createProfile = (data) => api.post('/profiles', data)
export const updateProfile = (id, data) => api.put('/profiles', data)

// External APIs
export const searchExternal = (query, type, page = 1) => 
  api.get('/external/search', { params: { q: query, type, page } })

export const getPopularMovies = (page = 1) => 
  api.get('/external/movies', { params: { page } })

export const getPopularSeries = (page = 1) => 
  api.get('/external/series', { params: { page } })

export const getPopularAnimes = (page = 1) => 
  api.get('/external/animes', { params: { page } })

export const getMovieDetails = (id) => 
  api.get(`/external/movies/${id}`)

export const getSeriesDetails = (id) => 
  api.get(`/external/series/${id}`)

export const getAnimeDetails = (id) => 
  api.get(`/external/animes/${id}`)

export default api

