import { prisma } from '../config/database.js'

const PRIORITY_WEIGHTS = {
  URGENT: 10,
  HIGH: 5,
  MEDIUM: 2,
  LOW: 1,
}

const fetchUnwatchedMovies = async (profileId) => {
  return prisma.movie.findMany({
    where: { addedById: profileId, watched: false },
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

export const drawMovie = async (profileId) => {
  const unwatched = await fetchUnwatchedMovies(profileId)
  if (unwatched.length === 0) return null

  const pool = buildWeightedPool(unwatched)
  return pickRandom(pool)
}
