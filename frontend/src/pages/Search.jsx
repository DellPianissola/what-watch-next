import { useState } from 'react'
import { searchExternal, createMovie } from '../services/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import './Search.css'

const Search = () => {
  const { profile } = useAuth()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ movies: [], series: [], animes: [] })
  const [addingMovie, setAddingMovie] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await searchExternal(query, type === 'all' ? null : type)
      setResults(response.data.results)
    } catch (error) {
      console.error('Erro ao buscar:', error)
      alert('Erro ao buscar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMovie = async (movie) => {
    if (!profile) {
      alert('Perfil não encontrado!')
      return
    }

    setAddingMovie(movie.id)
    try {
      // Mapeia o tipo para o formato esperado pelo backend
      const typeMap = {
        'MOVIE': 'MOVIE',
        'SERIES': 'SERIES',
        'ANIME': 'ANIME',
        'movie': 'MOVIE',
        'series': 'SERIES',
        'anime': 'ANIME',
      }
      
      const movieData = {
        title: movie.title,
        type: typeMap[movie.type] || movie.type,
        description: movie.description,
        poster: movie.poster,
        year: movie.year,
        duration: movie.duration,
        genres: movie.genres || [],
        rating: movie.rating,
        externalId: movie.externalId?.toString(),
        priority: 'MEDIUM',
        isNew: true,
      }

      await createMovie(movieData)
      alert('Filme adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar filme:', error)
      alert(error.response?.data?.error || 'Erro ao adicionar filme')
    } finally {
      setAddingMovie(null)
    }
  }

  const allResults = [...results.movies, ...results.series, ...results.animes]

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Buscar Filmes, Séries e Animes</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o nome do filme, série ou anime..."
              className="search-input"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="search-type-select"
            >
              <option value="all">Todos</option>
              <option value="movie">Filmes</option>
              <option value="series">Séries</option>
              <option value="anime">Animes</option>
            </select>
            <button type="submit" disabled={loading} className="btn-search">
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>


        {allResults.length > 0 && (
          <div className="results-grid">
            {allResults.map((item) => (
              <div key={item.id} className="result-card">
                {item.poster && (
                  <img src={item.poster} alt={item.title} className="result-poster" />
                )}
                <div className="result-info">
                  <h3>{item.title}</h3>
                  <p className="result-type">
                    {item.type === 'MOVIE' ? 'Filme' : 
                     item.type === 'SERIES' ? 'Série' : 
                     item.type === 'ANIME' ? 'Anime' : item.type}
                  </p>
                  {item.description && (
                    <p className="result-description">
                      {item.description.substring(0, 150)}...
                    </p>
                  )}
                  <div className="result-meta">
                    {item.year && <span>📅 {item.year}</span>}
                    {item.rating && <span>⭐ {item.rating}</span>}
                    {item.genres && item.genres.length > 0 && (
                      <span>🎭 {item.genres.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddMovie(item)}
                    disabled={!profile || addingMovie === item.id}
                    className="btn-add"
                  >
                    {addingMovie === item.id ? 'Adicionando...' : '➕ Adicionar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query && allResults.length === 0 && (
          <p className="no-results">Nenhum resultado encontrado</p>
        )}
      </div>
    </div>
  )
}

export default Search

