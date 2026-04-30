import { prisma } from '../config/database.js'

const PRIORITY_WEIGHTS = {
  URGENT: 10,
  HIGH: 5,
  MEDIUM: 2,
  LOW: 1,
}

// Sorteia entre filmes do perfil. Aceita filtros opcionais vindos da UI:
//   - types: array de MOVIE/SERIES/ANIME (já validado pelo service).
//   - genres: array de nomes de gênero (match se o filme tiver QUALQUER um).
//   - ignoreWatched: se true, exclui assistidos.
const fetchEligibleMovies = async (profileId, filters = {}) => {
  const where = { addedById: profileId }

  if (filters.types?.length) where.type = { in: filters.types }
  if (filters.genres?.length) where.genres = { hasSome: filters.genres }
  if (filters.ignoreWatched) where.watched = false

  return prisma.movie.findMany({
    where,
    include: {
      addedBy: { select: { id: true, name: true } },
    },
  })
}

const buildWeightedPool = (movies) => {
  const pool = []
  for (const movie of movies) {
    const weight = PRIORITY_WEIGHTS[movie.priority] || 1
    for (let i = 0; i < weight; i++) {
      pool.push(movie)
    }
  }
  return pool
}

const pickRandom = (pool) => {
  return pool[Math.floor(Math.random() * pool.length)]
}

// Conta itens do perfil ignorando filtros — usado pra distinguir
// "lista vazia" de "filtros não casaram com nada".
const countAllMovies = (profileId) =>
  prisma.movie.count({ where: { addedById: profileId } })

export const drawMovie = async (profileId, filters = {}) => {
  const eligible = await fetchEligibleMovies(profileId, filters)
  if (eligible.length > 0) {
    const pool = buildWeightedPool(eligible)
    return { movie: pickRandom(pool) }
  }

  const total = await countAllMovies(profileId)
  return { movie: null, reason: total === 0 ? 'EMPTY_LIST' : 'NO_MATCH' }
}
