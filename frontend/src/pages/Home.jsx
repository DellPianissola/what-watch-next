import { useState, useEffect } from 'react'
import './Home.css'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
            <button className="btn btn-primary">
              <span className="btn-icon">🎲</span>
              <span className="btn-text">Sortear</span>
            </button>
            <button className="btn btn-secondary">
              <span className="btn-icon">➕</span>
              <span className="btn-text">Adicionar</span>
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📋</span>
              <span className="btn-text">Minha Lista</span>
            </button>
          </div>

          {/* Stats Preview */}
          <div className="stats-preview">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Filmes</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Séries</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">0</div>
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

