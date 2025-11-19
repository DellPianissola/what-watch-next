import { useState, useEffect, useRef } from 'react'
import { searchExternal, createMovie, getMovies, deleteMovie, getPopularMovies, getPopularSeries, getPopularAnimes } from '../services/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import PosterPlaceholder from '../components/PosterPlaceholder.jsx'
import './Search.css'

const Search = () => {
  const { profile } = useAuth()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('movie')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ movies: [], series: [], animes: [] })
  const [addingMovie, setAddingMovie] = useState(null)
  const [userMovies, setUserMovies] = useState([])
  const [sortDate, setSortDate] = useState(null) // null, 'asc', 'desc'
  const [sortRating, setSortRating] = useState(null) // null, 'asc', 'desc'
  const [selectedGenres, setSelectedGenres] = useState([])
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 18
  const debounceTimer = useRef(null)
  const genreDropdownRef = useRef(null)

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false)
      }
    }

    if (showGenreDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showGenreDropdown])

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

  // Limpa gêneros selecionados ao mudar o tipo
  useEffect(() => {
    setSelectedGenres([])
  }, [type])

  // Reseta página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [query, type, selectedGenres, sortDate, sortRating])

  // Busca automática com debounce ou carrega populares
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!query.trim()) {
      // Quando não há query, carrega os populares do tipo selecionado
      setLoading(true)
      const loadPopular = async () => {
        try {
          let results = { movies: [], series: [], animes: [] }
          
          if (type === 'movie') {
            const response = await getPopularMovies(1)
            results.movies = response.data.results || []
          } else if (type === 'series') {
            const response = await getPopularSeries(1)
            results.series = response.data.results || []
          } else if (type === 'anime') {
            const response = await getPopularAnimes(1)
            results.animes = response.data.results || []
          }
          
          setResults(results)
        } catch (error) {
          console.error('Erro ao carregar conteúdo popular:', error)
        } finally {
          setLoading(false)
        }
      }
      
      loadPopular()
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await searchExternal(query, type)
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

  // Extrai gêneros únicos dos resultados
  const allResults = [...results.movies, ...results.series, ...results.animes]
  const allGenres = [...new Set(allResults.flatMap(item => item.genres || []))].sort()

  // Filtra e ordena os resultados
  const filteredAndSortedResults = allResults
    .filter(item => {
      // Filtro por gêneros
      if (selectedGenres.length > 0) {
        const itemGenres = item.genres || []
        return selectedGenres.some(genre => itemGenres.includes(genre))
      }
      return true
    })
    .sort((a, b) => {
      let result = 0
      
      // Ordenação por data
      if (sortDate) {
        const dateA = a.year || 0
        const dateB = b.year || 0
        if (sortDate === 'asc') {
          result = dateA - dateB
        } else if (sortDate === 'desc') {
          result = dateB - dateA
        }
        // Se o resultado da data for diferente de zero, retorna
        if (result !== 0) return result
      }
      
      // Ordenação por nota (se a data não diferenciar ou não estiver ativa)
      if (sortRating) {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        if (sortRating === 'asc') {
          result = ratingA - ratingB
        } else if (sortRating === 'desc') {
          result = ratingB - ratingA
        }
      }
      
      return result
    })

  // Calcula paginação
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedResults = filteredAndSortedResults.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleSortDate = () => {
    setSortDate(prev => {
      if (prev === null) {
        setSortRating(null) // Desativa o outro filtro
        return 'desc'
      }
      if (prev === 'desc') return 'asc'
      return null
    })
  }

  const toggleSortRating = () => {
    setSortRating(prev => {
      if (prev === null) {
        setSortDate(null) // Desativa o outro filtro
        return 'desc'
      }
      if (prev === 'desc') return 'asc'
      return null
    })
  }

  const getSortIcon = (sortState) => {
    if (sortState === 'asc') return '↑'
    if (sortState === 'desc') return '↓'
    return ''
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-header">
            <div className="search-type-filters">
              <button
                type="button"
                onClick={() => setType('movie')}
                className={`filter-btn ${type === 'movie' ? 'active' : ''}`}
              >
                🎬 Filmes
              </button>
              <button
                type="button"
                onClick={() => setType('series')}
                className={`filter-btn ${type === 'series' ? 'active' : ''}`}
              >
                📺 Séries
              </button>
              <button
                type="button"
                onClick={() => setType('anime')}
                className={`filter-btn ${type === 'anime' ? 'active' : ''}`}
              >
                🎌 Animes
              </button>
            </div>
            
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o nome do filme, série ou anime..."
                className="search-input"
              />
            </div>

            <div className="search-sort-filters">
              <div className="sort-buttons">
                <button
                  type="button"
                  onClick={toggleSortDate}
                  className={`sort-btn ${sortDate ? 'active' : ''}`}
                >
                  📅 Data {getSortIcon(sortDate)}
                </button>
                <button
                  type="button"
                  onClick={toggleSortRating}
                  className={`sort-btn ${sortRating ? 'active' : ''}`}
                >
                  ⭐ Nota {getSortIcon(sortRating)}
                </button>
              </div>
              
              <div className="genre-dropdown-wrapper" ref={genreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                  className="genre-dropdown-btn"
                >
                  🎭 Gêneros {selectedGenres.length > 0 && `(${selectedGenres.length})`}
                </button>
                {showGenreDropdown && (
                  <div className="genre-dropdown">
                    {allGenres.length > 0 ? (
                      allGenres.map(genre => (
                        <label key={genre} className="genre-option">
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre)}
                            onChange={() => toggleGenre(genre)}
                          />
                          <span>{genre}</span>
                        </label>
                      ))
                    ) : (
                      <div className="genre-dropdown-empty">Nenhum gênero disponível</div>
                    )}
                  </div>
                )}
              </div>
            </div>
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

        {!loading && paginatedResults.length > 0 && (
          <div className="results-grid">
            {paginatedResults.map((item) => {
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

        {!loading && filteredAndSortedResults.length > 0 && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Anterior
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Mostra primeira página, última página, página atual e páginas adjacentes
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="pagination-ellipsis">...</span>
                }
                return null
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Próxima →
            </button>
          </div>
        )}

        {!loading && filteredAndSortedResults.length === 0 && (
          <p className="no-results">
            {query ? 'Nenhum resultado encontrado' : 'Nenhum conteúdo popular encontrado'}
          </p>
        )}
      </div>
    </div>
  )
}

export default Search

