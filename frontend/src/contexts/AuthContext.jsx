import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const logout = () => {
    setUser(null)
    setProfile(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  // Configura o token no axios quando muda
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  // Verifica se o usuário está autenticado ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          setToken(storedToken)
          const response = await api.get('/auth/me')
          setUser(response.data.user)
          // Busca o perfil separadamente
          try {
            const profileResponse = await api.get('/profiles')
            setProfile(profileResponse.data.profile)
          } catch (profileError) {
            // Perfil pode não existir ainda, isso é ok
            console.log('Perfil ainda não criado')
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error)
          logout()
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, profile, token } = response.data
      setUser(user)
      setProfile(profile)
      setToken(token)
      // Busca o perfil completo após login
      if (token) {
        try {
          const profileResponse = await api.get('/profiles')
          setProfile(profileResponse.data.profile)
        } catch (profileError) {
          // Perfil pode não existir ainda
          console.log('Perfil ainda não criado')
        }
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login',
      }
    }
  }

  const register = async (email, username, password) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
      })
      const { user, profile, token } = response.data
      setUser(user)
      setProfile(profile)
      setToken(token)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao registrar',
      }
    }
  }

  const updateProfile = (newProfile) => {
    setProfile(newProfile)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

