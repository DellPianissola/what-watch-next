import { randomUUID } from 'crypto'
import { prisma } from '../config/database.js'
import { uploadFile } from '../lib/storageClient.js'
import { ValidationError, NotFoundError } from '../lib/httpErrors.js'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export const uploadAvatar = async (userId, buffer, mimeType) => {
  if (!buffer || buffer.length === 0) {
    throw new ValidationError('Arquivo vazio.')
  }
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new ValidationError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
  }
  if (buffer.length > MAX_SIZE_BYTES) {
    throw new ValidationError('Arquivo muito grande. O limite é 5 MB.')
  }

  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Perfil não encontrado.')

  const key = `avatars/${userId}-${randomUUID()}.${EXT[mimeType]}`
  const url = await uploadFile(key, buffer, mimeType)

  return prisma.profile.update({
    where: { userId },
    data:  { avatarUrl: url },
  })
}
