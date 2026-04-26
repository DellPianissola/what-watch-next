import express from 'express'
import tmdbService from '../services/tmdb.js'
import jikanService from '../services/jikan.js'

const router = express.Router()

const parseGenres = (raw) => {
  if (!raw) return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

// GET /api/external/search - Busca em todas as APIs
router.get('/search', async (req, res) => {
  try {
    const { q, type, page = 1, sortBy, genres } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro "q" (query) é obrigatório' })
    }

    let results = []
    let totalPages = 1
    const genreList = parseGenres(genres)

    if (type === 'anime') {
      // Jikan suporta busca textual + sort + gênero juntos
      const jikanData = await jikanService.search(q, page, { sortBy, genres: genreList })
      results = jikanData.results
      totalPages = jikanData.totalPages
    } else if (type === 'movie') {
      // TMDB /search NÃO suporta sort_by nem with_genres — ignorados intencionalmente
      const tmdbData = await tmdbService.search(q, 'movie', page)
      results = tmdbData.results
      totalPages = tmdbData.totalPages
    } else if (type === 'series') {
      const tmdbData = await tmdbService.search(q, 'tv', page)
      results = tmdbData.results
      totalPages = tmdbData.totalPages
    } else {
      // sem type: busca multi no TMDB + Jikan (sem sort/gênero)
      try {
        const tmdbData = await tmdbService.search(q, 'multi', page)
        results = [...results, ...tmdbData.results]
        totalPages = tmdbData.totalPages
      } catch (error) {
        console.error('Erro ao buscar no TMDB:', error.message)
      }
      try {
        const jikanData = await jikanService.search(q, page)
        results = [...results, ...jikanData.results]
      } catch (error) {
        console.error('Erro ao buscar no Jikan:', error.message)
      }
    }

    res.json({
      query: q,
      type: type || 'all',
      page: parseInt(page),
      totalPages,
      results,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/genres?type=movie|series|anime - Lista de gêneros disponíveis
router.get('/genres', async (req, res) => {
  try {
    const { type } = req.query
    let genres = []
    if (type === 'series') {
      genres = await tmdbService.getGenresList('tv')
    } else if (type === 'anime') {
      genres = await jikanService.getGenresList()
    } else {
      genres = await tmdbService.getGenresList('movie')
    }
    res.json({ type: type || 'movie', genres })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/movies - Lista filmes (discover) com sort/gênero
router.get('/movies', async (req, res) => {
  try {
    const { page = 1, sortBy, genres } = req.query
    const { results, totalPages } = await tmdbService.discover('movie', {
      page,
      sortBy,
      genres: parseGenres(genres),
    })
    res.json({
      page: parseInt(page),
      totalPages,
      results,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/series - Lista séries (discover) com sort/gênero
router.get('/series', async (req, res) => {
  try {
    const { page = 1, sortBy, genres } = req.query
    const { results, totalPages } = await tmdbService.discover('tv', {
      page,
      sortBy,
      genres: parseGenres(genres),
    })
    res.json({
      page: parseInt(page),
      totalPages,
      results,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/animes - Lista animes com sort/gênero
router.get('/animes', async (req, res) => {
  try {
    const { page = 1, sortBy, genres } = req.query
    const { results, totalPages } = await jikanService.getPopularAnimes(page, {
      sortBy,
      genres: parseGenres(genres),
    })
    res.json({
      page: parseInt(page),
      totalPages,
      results,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/movies/:id - Detalhes de filme
router.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const movie = await tmdbService.getMovieDetails(id)
    res.json(movie)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/series/:id - Detalhes de série
router.get('/series/:id', async (req, res) => {
  try {
    const { id } = req.params
    const series = await tmdbService.getSeriesDetails(id)
    res.json(series)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/animes/:id - Detalhes de anime
router.get('/animes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const anime = await jikanService.getAnimeDetails(id)
    res.json(anime)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

