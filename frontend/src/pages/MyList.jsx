import { useState, useEffect } from 'react'
import { getMovies, deleteMovie, updateMovie } from '../services/api.js'
import './MyList.css'

const MyList = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    type: '',
    watched: '',
  })

  useEffect(() => {
    loadMovies()
  }, [filter])

  const loadMovies = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.type) params.type = filter.type
      if (filter.watched !== '') params.watched = filter.watched

      const response = await getMovies(params)
      setMovies(response.data.movies)
    } catch (error) {
      console.error('Erro ao carregar filmes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja remover este filme?')) return

    try {
      await deleteMovie(id)
      loadMovies()
    } catch (error) {
      console.error('Erro ao remover filme:', error)
      alert('Erro ao remover filme')
    }
  }

  const handleToggleWatched = async (movie) => {
    try {
      await updateMovie(movie.id, {
        watched: !movie.watched,
      })
      loadMovies()
    } catch (error) {
      console.error('Erro ao atualizar filme:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return '#ef4444'
      case 'HIGH': return '#f59e0b'
      case 'MEDIUM': return '#3b82f6'
      case 'LOW': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'URGENT': return 'Urgente'
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority
    }
  }

  return (
    <div className="mylist-page">
      <div className="mylist-container">
        <h2>Minha Lista</h2>

        <div className="filters">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos os tipos</option>
            <option value="MOVIE">Filmes</option>
            <option value="SERIES">Séries</option>
            <option value="ANIME">Animes</option>
          </select>

          <select
            value={filter.watched}
            onChange={(e) => setFilter({ ...filter, watched: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="false">Não assistidos</option>
            <option value="true">Assistidos</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum filme adicionado ainda</p>
            <p className="empty-hint">Use a busca para adicionar filmes à sua lista!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className={`movie-card ${movie.watched ? 'watched' : ''}`}>
                {movie.poster && (
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                )}
                <div className="movie-info">
                  <div className="movie-header">
                    <h3>{movie.title}</h3>
                    {movie.isNew && <span className="new-badge">NOVO</span>}
                  </div>
                  <p className="movie-type">
                    {movie.type === 'MOVIE' ? 'Filme' : 
                     movie.type === 'SERIES' ? 'Série' : 
                     movie.type === 'ANIME' ? 'Anime' : movie.type}
                  </p>
                  {movie.description && (
                    <p className="movie-description">
                      {movie.description.substring(0, 100)}...
                    </p>
                  )}
                  <div className="movie-meta">
                    {movie.year && <span>📅 {movie.year}</span>}
                    {movie.rating && <span>⭐ {movie.rating}</span>}
                    {movie.genres && movie.genres.length > 0 && (
                      <span>🎭 {movie.genres.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                  <div className="movie-footer">
                    <div className="priority-badge" style={{ backgroundColor: getPriorityColor(movie.priority) }}>
                      {getPriorityLabel(movie.priority)}
                    </div>
                    <span className="added-by">Por: {movie.addedBy?.name || 'Desconhecido'}</span>
                  </div>
                  <div className="movie-actions">
                    <button
                      onClick={() => handleToggleWatched(movie)}
                      className={`btn-toggle ${movie.watched ? 'watched' : ''}`}
                    >
                      {movie.watched ? '✅ Assistido' : '⭕ Não assistido'}
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="btn-delete"
                    >
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyList

