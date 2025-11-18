import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMovies } from '../services/api.js'
import './Home.css'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stats, setStats] = useState({ movies: 0, series: 0, animes: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await getMovies()
      const movies = response.data.movies
      
      setStats({
        movies: movies.filter(m => m.type === 'MOVIE').length,
        series: movies.filter(m => m.type === 'SERIES').length,
        animes: movies.filter(m => m.type === 'ANIME').length,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  return (
    <div className="home">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Main Content */}
      <div className={`home-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Header */}
        <header className="home-header">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <h1 className="logo-text">What Watch Next</h1>
          </div>
          <p className="tagline">Escolha o que assistir juntos</p>
        </header>

        {/* Main Card */}
        <div className="main-card">
          <div className="card-header">
            <h2>Bem-vindos!</h2>
            <p className="subtitle">O que vamos assistir hoje?</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/search')}
            >
              <span className="btn-icon">🔍</span>
              <span className="btn-text">Buscar</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/list')}
            >
              <span className="btn-icon">📋</span>
              <span className="btn-text">Minha Lista</span>
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/profiles')}
            >
              <span className="btn-icon">👥</span>
              <span className="btn-text">Perfis</span>
            </button>
          </div>

          {/* Stats Preview */}
          <div className="stats-preview">
            <div className="stat-item">
              <div className="stat-value">{stats.movies}</div>
              <div className="stat-label">Filmes</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">{stats.series}</div>
              <div className="stat-label">Séries</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">{stats.animes}</div>
              <div className="stat-label">Animes</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Perfis</h3>
            <p>Cada um adiciona seus favoritos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Prioridades</h3>
            <p>Organize por importância</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆕</div>
            <h3>Novidades</h3>
            <p>Fique por dentro do que é novo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Sorteio Inteligente</h3>
            <p>Algoritmo que considera preferências</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <p>Feito com ❤️ para assistir juntos</p>
        </footer>
      </div>
    </div>
  )
}

export default Home

