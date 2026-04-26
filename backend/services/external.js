import tmdbService from './tmdb.js'
import jikanService from './jikan.js'
import { ValidationError } from '../lib/httpErrors.js'

/**
 * Camada de orquestração entre os providers externos (TMDB e Jikan).
 *
 * `tmdb.js` e `jikan.js` são adapters de provider (baixo nível, falam HTTP
 * com a API). Aqui em cima ficam as regras de:
 *   - qual provider chamar baseado no `type`
 *   - como aplicar sort/genres respeitando limitações de cada API
 *   - como combinar resultados quando há multi (sem `type`)
 */

const TMDB_TYPE_MAP = {
  movie: 'movie',
  series: 'tv', // pra TMDB, "series" vira "tv"
}

const parseGenres = (raw) => {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

// ─── Busca textual ──────────────────────────────────────────────────────────

/**
 * Busca textual em todas as APIs. Roteamento por `type`:
 *   - anime  → Jikan (suporta q + sort + genres juntos)
 *   - movie  → TMDB /search/movie (sort/genres ignorados — limitação da API)
 *   - series → TMDB /search/tv (idem)
 *   - sem type → multi: TMDB /search/multi + Jikan, resultados combinados.
 *
 * Em modo "multi", falha de um provider não derruba a busca — acumula o que
 * deu certo. Em modo type-specific, exceções propagam pro middleware de erros.
 */
export const searchByText = async ({ q, type, page = 1, sortBy, genres }) => {
  if (!q) {
    throw new ValidationError('Parâmetro "q" (query) é obrigatório')
  }

  const genreList = parseGenres(genres)

  if (type === 'anime') {
    const data = await jikanService.search(q, page, { sortBy, genres: genreList })
    return formatSearchResponse({ q, type, page, totalPages: data.totalPages, results: data.results })
  }

  if (type === 'movie' || type === 'series') {
    // TMDB /search ignora sortBy/genres (limitação da API)
    const tmdbType = TMDB_TYPE_MAP[type]
    const data = await tmdbService.search(q, tmdbType, page)
    return formatSearchResponse({ q, type, page, totalPages: data.totalPages, results: data.results })
  }

  // Sem type: combina TMDB multi + Jikan, com tolerância a falhas
  const [tmdbResults, jikanResults] = await Promise.all([
    safeProviderCall(() => tmdbService.search(q, 'multi', page), 'TMDB'),
    safeProviderCall(() => jikanService.search(q, page), 'Jikan'),
  ])

  return formatSearchResponse({
    q,
    type: 'all',
    page,
    totalPages: tmdbResults?.totalPages || 1,
    results: [...(tmdbResults?.results || []), ...(jikanResults?.results || [])],
  })
}

// Wrapper que captura erro de um provider e devolve null pra não interromper
// busca multi. Loga pra ficar visível em prod.
const safeProviderCall = async (fn, providerName) => {
  try {
    return await fn()
  } catch (error) {
    console.error(`Erro ao buscar no ${providerName}:`, error.message)
    return null
  }
}

const formatSearchResponse = ({ q, type, page, totalPages, results }) => ({
  query: q,
  type: type || 'all',
  page: parseInt(page),
  totalPages,
  results,
})

// ─── Discover (listagens populares com sort/genres) ─────────────────────────

/**
 * Lista de conteúdo (sem busca textual). Roteia pro provider certo e aplica
 * sort/genres no nível da API (server-side, nada client-side).
 */
export const discoverByType = async (type, { page = 1, sortBy, genres } = {}) => {
  const genreList = parseGenres(genres)
  const opts = { page, sortBy, genres: genreList }

  let data
  if (type === 'anime') {
    data = await jikanService.getPopularAnimes(page, opts)
  } else if (type === 'series') {
    data = await tmdbService.discover('tv', opts)
  } else {
    // default: movie
    data = await tmdbService.discover('movie', opts)
  }

  return {
    page: parseInt(page),
    totalPages: data.totalPages,
    results: data.results,
  }
}

// ─── Gêneros ────────────────────────────────────────────────────────────────

export const listGenres = async (type) => {
  if (type === 'series') return tmdbService.getGenresList('tv')
  if (type === 'anime') return jikanService.getGenresList()
  return tmdbService.getGenresList('movie')
}

// ─── Detalhes ───────────────────────────────────────────────────────────────

const VALID_DETAIL_TYPES = ['movie', 'series', 'anime']

export const getDetails = async (type, id) => {
  if (!VALID_DETAIL_TYPES.includes(type)) {
    throw new ValidationError(`Tipo inválido: ${type}. Use movie, series ou anime`)
  }

  if (type === 'movie') return tmdbService.getMovieDetails(id)
  if (type === 'series') return tmdbService.getSeriesDetails(id)
  return jikanService.getAnimeDetails(id)
}
