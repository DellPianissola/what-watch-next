import express from 'express'
import tmdbService from '../services/tmdb.js'
import jikanService from '../services/jikan.js'

const router = express.Router()

// GET /api/external/search - Busca em todas as APIs
router.get('/search', async (req, res) => {
  try {
    const { q, type, page = 1 } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro "q" (query) é obrigatório' })
    }

    const results = {
      movies: [],
      series: [],
      animes: [],
    }

    if (!type || type === 'movie' || type === 'series') {
      try {
        const tmdbResults = await tmdbService.search(q, 'multi', page)
        results.movies = tmdbResults.filter(r => r.type === 'MOVIE')
        results.series = tmdbResults.filter(r => r.type === 'SERIES')
      } catch (error) {
        console.error('Erro ao buscar no TMDB:', error.message)
      }
    }

    if (!type || type === 'anime') {
      try {
        results.animes = await jikanService.search(q, page)
      } catch (error) {
        console.error('Erro ao buscar no Jikan:', error.message)
      }
    }

    res.json({
      query: q,
      type: type || 'all',
      page: parseInt(page),
      results,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/movies - Busca filmes populares
router.get('/movies', async (req, res) => {
  try {
    const { page = 1 } = req.query
    const movies = await tmdbService.getPopularMovies(page)
    res.json({
      page: parseInt(page),
      results: movies,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/series - Busca séries populares
router.get('/series', async (req, res) => {
  try {
    const { page = 1 } = req.query
    const series = await tmdbService.getPopularSeries(page)
    res.json({
      page: parseInt(page),
      results: series,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/external/animes - Busca animes populares
router.get('/animes', async (req, res) => {
  try {
    const { page = 1 } = req.query
    const animes = await jikanService.getPopularAnimes(page)
    res.json({
      page: parseInt(page),
      results: animes,
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

