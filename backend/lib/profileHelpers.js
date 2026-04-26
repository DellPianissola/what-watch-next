import { prisma } from '../config/database.js'
import { NotFoundError } from './httpErrors.js'

/**
 * Busca o perfil do usuário autenticado e lança 404 se não existir.
 *
 * Esse padrão "userId → buscar profile → checar existe → usar profile.id"
 * aparecia inline em ~5 lugares de routes/movies.js e routes/profiles.js.
 * Centralizar aqui evita duplicação e padroniza a mensagem de erro.
 *
 * Uso (em service):
 *   const profile = await requireUserProfile(userId)
 *   const movies = await prisma.movie.findMany({ where: { addedById: profile.id } })
 */
export const requireUserProfile = async (userId) => {
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) {
    throw new NotFoundError('Perfil não encontrado')
  }
  return profile
}
