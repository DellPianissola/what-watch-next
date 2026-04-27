import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMovies, deleteMovie, updateMovie, getMovieDetails, getSeriesDetails, getAnimeDetails } from '../services/api.js'
import { useNotify } from '../contexts/NotificationContext.jsx'
import PosterPlaceholder from '../components/PosterPlaceholder.jsx'
import { detailsCache, trailerUrl } from '../utils/detailsCache.js'
import '../components/CardModal.css'
import './MyList.css'

const MyList = () => {
  const navigate = useNavigate()
  const { toast } = useNotify()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: '', watched: '' })
  const [expandedItemId, setExpandedItemId] = useState(null)
  const [richDetails, setRichDetails] = useState(null)
  const [richDetailsLoading, setRichDetailsLoading] = useState(false)

  // expandedItem é sempre derivado do array — reage automaticamente a toggles e deletes
  const expandedItem = movies.find(m => m.id === expandedItemId) ?? null

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
    if (!confirm('Tem certeza que deseja remover este item?')) return
    try {
      await deleteMovie(id)
      setExpandedItemId(null)
      setMovies(prev => prev.filter(m => m.id !== id))
      toast.success('Item removido da lista')
    } catch (error) {
      console.error('Erro ao remover:', error)
      toast.error('Erro ao remover item')
    }
  }

  const handleToggleWatched = async (movie) => {
    const newWatched = !movie.watched
    try {
      await updateMovie(movie.id, { watched: newWatched })
      setMovies(prev => {
        // Se há filtro de "watched" ativo e o novo estado não bate, remove o item da view local
        if (filter.watched !== '' && String(newWatched) !== filter.watched) {
          return prev.filter(m => m.id !== movie.id)
        }
        return prev.map(m => m.id === movie.id ? { ...m, watched: newWatched } : m)
      })
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao atualizar item')
    }
  }

  // Busca detalhes ricos quando o modal abre
  useEffect(() => {
    if (!expandedItem?.externalId) {
      setRichDetails(null)
      return
    }

    const cacheKey = `${expandedItem.type}:${expandedItem.externalId}`
    if (detailsCache.has(cacheKey)) {
      setRichDetails(detailsCache.get(cacheKey))
      setRichDetailsLoading(false)
      return
    }

    let cancelled = false
    setRichDetails(null)
    setRichDetailsLoading(true)

    const fetchDetails = async () => {
      try {
        let response
        if (expandedItem.type === 'MOVIE') response = await getMovieDetails(expandedItem.externalId)
        else if (expandedItem.type === 'SERIES') response = await getSeriesDetails(expandedItem.externalId)
        else response = await getAnimeDetails(expandedItem.externalId)

        if (!cancelled) {
          detailsCache.set(cacheKey, response.data)
          setRichDetails(response.data)
        }
      } catch (error) {
        if (!cancelled) console.error('Erro ao carregar detalhes:', error)
      } finally {
        if (!cancelled) setRichDetailsLoading(false)
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [expandedItem?.externalId, expandedItem?.type])

  // ESC + trava scroll do body
  useEffect(() => {
    if (!expandedItemId) return
    const onKey = (e) => { if (e.key === 'Escape') setExpandedItemId(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [expandedItemId])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return '#ef4444'
      case 'HIGH':   return '#f59e0b'
      case 'MEDIUM': return '#3b82f6'
      case 'LOW':    return '#6b7280'
      default:       return '#6b7280'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'URGENT': return 'Urgente'
      case 'HIGH':   return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW':    return 'Baixa'
      default:       return priority
    }
  }

  const moviesByCategory = {
    movies: movies.filter(m => m.type === 'MOVIE'),
    series: movies.filter(m => m.type === 'SERIES'),
    animes: movies.filter(m => m.type === 'ANIME'),
  }

  const renderMovieCard = (movie) => {
    const genresText = movie.genres?.length > 0 ? movie.genres.join(', ') : 'Sem gênero'

    return (
      <div
        key={movie.id}
        className={`movie-card ${movie.watched ? 'watched' : ''}`}
        onClick={() => setExpandedItemId(movie.id)}
      >
        <div className="movie-poster-container">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
          ) : (
            <PosterPlaceholder title={movie.title} type={movie.type} className="movie-poster" />
          )}
          <span className="movie-type-badge">
            {movie.type === 'MOVIE' ? 'Filme' :
             movie.type === 'SERIES' ? 'Série' :
             movie.type === 'ANIME' ? 'Anime' : movie.type}
          </span>
          <span
            className="movie-priority-badge"
            style={{ backgroundColor: getPriorityColor(movie.priority) }}
          >
            {getPriorityLabel(movie.priority)}
          </span>
        </div>
        <div className="movie-info">
          <div className="movie-header">
            <h3>{movie.title}</h3>
            {movie.isNew && <span className="new-badge">NOVO</span>}
          </div>
          <div className="movie-footer">
            <div className="movie-meta">
              <span>📅 {movie.year || 'Sem data'}</span>
              <span>⭐ {movie.rating || 'Sem nota'}</span>
              <span className="genres-span" title={genresText}>🎭 {genresText}</span>
            </div>
            <div className="movie-actions">
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleWatched(movie) }}
                className={`btn-toggle ${movie.watched ? 'watched' : ''}`}
              >
                {movie.watched ? '✅ Assistido' : '⭕ Não assistido'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(movie.id) }}
                className="btn-delete-icon"
                title="Remover da lista"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mylist-page">
      <div className="mylist-container">
        <div className="mylist-header">
          <h2>Minha Lista</h2>
          <button className="btn-add-new" onClick={() => navigate('/search')}>
            ➕ Adicionar
          </button>
        </div>

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
            <p>Nenhum item adicionado ainda</p>
            <p className="empty-hint">Clique em "Adicionar" para buscar filmes, séries e animes!</p>
            <button className="btn-add-empty" onClick={() => navigate('/search')}>
              ➕ Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="movies-by-category">
            {moviesByCategory.movies.length > 0 && (
              <div className="category-section">
                <h3 className="category-title">🎬 Filmes ({moviesByCategory.movies.length})</h3>
                <div className="movies-grid">
                  {moviesByCategory.movies.map(renderMovieCard)}
                </div>
              </div>
            )}
            {moviesByCategory.series.length > 0 && (
              <div className="category-section">
                <h3 className="category-title">📺 Séries ({moviesByCategory.series.length})</h3>
                <div className="movies-grid">
                  {moviesByCategory.series.map(renderMovieCard)}
                </div>
              </div>
            )}
            {moviesByCategory.animes.length > 0 && (
              <div className="category-section">
                <h3 className="category-title">🎌 Animes ({moviesByCategory.animes.length})</h3>
                <div className="movies-grid">
                  {moviesByCategory.animes.map(renderMovieCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {expandedItem && (
        <div className="card-modal-backdrop" onClick={() => setExpandedItemId(null)}>
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <button className="card-modal-close" onClick={() => setExpandedItemId(null)}>✕</button>
            <div className="card-modal-body">
              <div className="card-modal-poster-col">
                {expandedItem.poster ? (
                  <img src={expandedItem.poster} alt={expandedItem.title} />
                ) : (
                  <PosterPlaceholder title={expandedItem.title} type={expandedItem.type} className="result-poster" />
                )}
              </div>
              <div className="card-modal-info">
                <div className="card-modal-title-row">
                  <h2>{expandedItem.title}</h2>
                  <span className="result-type-badge" style={{ position: 'static' }}>
                    {expandedItem.type === 'MOVIE' ? 'Filme' :
                     expandedItem.type === 'SERIES' ? 'Série' :
                     expandedItem.type === 'ANIME' ? 'Anime' : expandedItem.type}
                  </span>
                </div>
                <div className="card-modal-meta">
                  <span>📅 {expandedItem.year || 'Sem data'}</span>
                  <span>⭐ {expandedItem.rating || 'Sem nota'}</span>
                  {(richDetails?.duration || expandedItem.duration) && (
                    <span>⏱ {richDetails?.duration || expandedItem.duration} min</span>
                  )}
                </div>
                <div className="card-modal-genres">
                  🎭 {expandedItem.genres?.length > 0 ? expandedItem.genres.join(', ') : 'Sem gênero'}
                </div>
                <p className="card-modal-description">
                  {expandedItem.description || 'Sem sinopse disponível.'}
                </p>

                {richDetailsLoading && (
                  <div className="card-modal-rich-skeleton">
                    <div className="skeleton-meta" style={{ width: '70%' }}></div>
                    <div className="skeleton-meta" style={{ width: '90%' }}></div>
                    <div className="skeleton-meta" style={{ width: '50%' }}></div>
                  </div>
                )}

                {!richDetailsLoading && richDetails && (
                  <div className="card-modal-rich-details">
                    {richDetails.director && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Direção</span>
                        <span>{richDetails.director}</span>
                      </div>
                    )}
                    {richDetails.cast?.length > 0 && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Elenco</span>
                        <span>{richDetails.cast.join(', ')}</span>
                      </div>
                    )}
                    {richDetails.seasons && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Temporadas</span>
                        <span>{richDetails.seasons}</span>
                      </div>
                    )}
                    {richDetails.episodes && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Episódios</span>
                        <span>{richDetails.episodes}</span>
                      </div>
                    )}
                    {richDetails.studios?.length > 0 && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Estúdio</span>
                        <span>{richDetails.studios.join(', ')}</span>
                      </div>
                    )}
                    {richDetails.status && (
                      <div className="card-modal-detail-row">
                        <span className="card-modal-detail-label">Status</span>
                        <span>{richDetails.status}</span>
                      </div>
                    )}
                    {trailerUrl(richDetails.trailer) && (
                      <a
                        href={trailerUrl(richDetails.trailer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-trailer"
                      >
                        ▶ Ver Trailer
                      </a>
                    )}
                  </div>
                )}

                <div className="card-modal-actions">
                  <div className="movie-actions" style={{ width: '100%' }}>
                    <button
                      onClick={() => handleToggleWatched(expandedItem)}
                      className={`btn-toggle ${expandedItem.watched ? 'watched' : ''}`}
                    >
                      {expandedItem.watched ? '✅ Assistido' : '⭕ Não assistido'}
                    </button>
                    <button
                      onClick={() => handleDelete(expandedItem.id)}
                      className="btn-delete-icon"
                      title="Remover da lista"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyList
