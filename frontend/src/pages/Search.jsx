import { useState, useEffect, useRef } from 'react'
import { searchExternal, createMovie, getMovies, deleteMovie, getPopularMovies, getPopularSeries, getPopularAnimes } from '../services/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import PosterPlaceholder from '../components/PosterPlaceholder.jsx'
import './Search.css'

const Search = () => {
  const { profile } = useAuth()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ movies: [], series: [], animes: [] })
  const [addingMovie, setAddingMovie] = useState(null)
  const [userMovies, setUserMovies] = useState([])
  const debounceTimer = useRef(null)

  // Carrega filmes do usuário para verificar duplicatas
  useEffect(() => {
    const loadUserMovies = async () => {
      try {
        const response = await getMovies()
        setUserMovies(response.data.movies)
      } catch (error) {
        console.error('Erro ao carregar filmes do usuário:', error)
      }
    }
    if (profile) {
      loadUserMovies()
    }
  }, [profile])

  // Busca automática com debounce ou carrega populares
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!query.trim()) {
      // Quando não há query, carrega os populares
      setLoading(true)
      Promise.all([
        getPopularMovies(1),
        getPopularSeries(1),
        getPopularAnimes(1)
      ])
        .then(([moviesResponse, seriesResponse, animesResponse]) => {
          setResults({
            movies: moviesResponse.data.results || [],
            series: seriesResponse.data.results || [],
            animes: animesResponse.data.results || []
          })
        })
        .catch((error) => {
          console.error('Erro ao carregar conteúdo popular:', error)
        })
        .finally(() => {
          setLoading(false)
        })
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await searchExternal(query, type === 'all' ? null : type)
        setResults(response.data.results)
      } catch (error) {
        console.error('Erro ao buscar:', error)
      } finally {
        setLoading(false)
      }
    }, 500) // 500ms de delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, type])

  const handleSearch = async (e) => {
    e.preventDefault()
    // A busca já é automática, mas mantemos o form para UX
  }

  // Verifica se o filme já está na lista do usuário
  const isMovieInList = (movie) => {
    return userMovies.some(userMovie => {
      // Compara por externalId se disponível, senão por título
      if (movie.externalId && userMovie.externalId) {
        return userMovie.externalId === movie.externalId.toString()
      }
      return userMovie.title.toLowerCase() === movie.title.toLowerCase() &&
             userMovie.type === (movie.type === 'MOVIE' ? 'MOVIE' : 
                                movie.type === 'SERIES' ? 'SERIES' : 
                                movie.type === 'ANIME' ? 'ANIME' : movie.type)
    })
  }

  const handleAddMovie = async (movie) => {
    if (!profile) {
      alert('Perfil não encontrado!')
      return
    }

    // Verifica se já está na lista
    if (isMovieInList(movie)) {
      // Remove o filme
      const userMovie = userMovies.find(userMovie => {
        if (movie.externalId && userMovie.externalId) {
          return userMovie.externalId === movie.externalId.toString()
        }
        return userMovie.title.toLowerCase() === movie.title.toLowerCase()
      })

      if (userMovie) {
        setAddingMovie(movie.id)
        try {
          await deleteMovie(userMovie.id)
          setUserMovies(userMovies.filter(m => m.id !== userMovie.id))
        } catch (error) {
          console.error('Erro ao remover filme:', error)
          alert(error.response?.data?.error || 'Erro ao remover filme')
        } finally {
          setAddingMovie(null)
        }
      }
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

      const response = await createMovie(movieData)
      setUserMovies([...userMovies, response.data.movie])
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
          </div>
        </form>


        {loading && (
          <div className="results-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="result-card skeleton-card">
                <div className="result-poster-container">
                  <div className="skeleton-poster"></div>
                </div>
                <div className="result-info">
                  <div className="skeleton-title"></div>
                  <div className="result-footer">
                    <div className="result-meta">
                      <div className="skeleton-meta"></div>
                      <div className="skeleton-meta"></div>
                      <div className="skeleton-meta"></div>
                    </div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && allResults.length > 0 && (
          <div className="results-grid">
            {allResults.map((item) => {
              const genresText = item.genres && item.genres.length > 0 
                ? item.genres.join(', ') 
                : 'Sem gênero'
              const genresDisplay = item.genres && item.genres.length > 0 
                ? item.genres.join(', ') 
                : 'Sem gênero'

              return (
                <div key={item.id} className="result-card">
                  <div className="result-poster-container">
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} className="result-poster" />
                    ) : (
                      <PosterPlaceholder 
                        title={item.title} 
                        type={item.type}
                        className="result-poster"
                      />
                    )}
                    <span className="result-type-badge">
                      {item.type === 'MOVIE' ? 'Filme' : 
                       item.type === 'SERIES' ? 'Série' : 
                       item.type === 'ANIME' ? 'Anime' : item.type}
                    </span>
                  </div>
                  <div className="result-info">
                    <h3>{item.title}</h3>
                    <div className="result-footer">
                      <div className="result-meta">
                        <span>📅 {item.year || 'Sem data'}</span>
                        <span>⭐ {item.rating || 'Sem nota'}</span>
                        <span 
                          className="genres-span"
                          title={genresText}
                        >
                          🎭 {genresDisplay}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddMovie(item)}
                        disabled={!profile || addingMovie === item.id}
                        className={`btn-add ${isMovieInList(item) ? 'btn-remove' : ''}`}
                      >
                        {addingMovie === item.id 
                          ? 'Processando...' 
                          : isMovieInList(item) 
                            ? '🗑️ Remover' 
                            : '➕ Adicionar'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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

