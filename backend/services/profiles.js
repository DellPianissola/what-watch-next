import { prisma } from '../config/database.js'
import { requireUserProfile } from '../lib/profileHelpers.js'
import { NotFoundError, ConflictError } from '../lib/httpErrors.js'

// `_count.movies` aparece em várias queries — extraído pra constante.
const COUNT_MOVIES = { _count: { select: { movies: true } } }

// ─── Operações públicas ─────────────────────────────────────────────────────

export const getProfile = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: COUNT_MOVIES,
  })
  if (!profile) {
    throw new NotFoundError('Perfil não encontrado')
  }
  return profile
}

export const getProfileWithMovies = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      movies: {
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      },
      ...COUNT_MOVIES,
    },
  })
  if (!profile) {
    throw new NotFoundError('Perfil não encontrado')
  }
  return profile
}

export const createProfile = async (userId, fallbackUsername, payload = {}) => {
  const existing = await prisma.profile.findUnique({ where: { userId } })
  if (existing) {
    throw new ConflictError('Usuário já possui um perfil')
  }

  return prisma.profile.create({
    data: {
      name: payload.name || fallbackUsername,
      userId,
    },
  })
}

export const updateProfile = async (userId, payload) => {
  await requireUserProfile(userId)

  const data = {}
  if (payload.name !== undefined) data.name = payload.name

  return prisma.profile.update({
    where: { userId },
    data,
  })
}

/**
 * Marca onboarding como concluído. Idempotente: se já estiver setado,
 * devolve o perfil sem sobrescrever a data original.
 */
export const markOnboarded = async (userId) => {
  const profile = await requireUserProfile(userId)

  if (profile.onboardedAt) {
    return { profile, alreadyCompleted: true }
  }

  const updated = await prisma.profile.update({
    where: { userId },
    data: { onboardedAt: new Date() },
  })

  return { profile: updated, alreadyCompleted: false }
}
