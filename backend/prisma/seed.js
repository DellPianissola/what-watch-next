import bcrypt from 'bcrypt'
import { prisma } from '../config/database.js'

// ─── Helpers ────────────────────────────────────────────────────────────────

const loadAdminCredentials = () => {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const email    = process.env.ADMIN_EMAIL || 'admin@localhost'

  if (!username || !password) {
    console.log('⚠️  ADMIN_USERNAME ou ADMIN_PASSWORD não definidos — seed do admin ignorado.')
    return null
  }

  return { username, password, email }
}

const adminAlreadyExists = async (username) => {
  const existing = await prisma.user.findUnique({ where: { username } })
  return !!existing
}

const createAdminUser = async (email, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { email, username, password: hashedPassword, isAdmin: true },
    select: { id: true, username: true },
  })
}

const createAdminProfile = async (username, userId) => {
  return prisma.profile.create({
    data: { name: username, userId },
  })
}

// ─── Main ────────────────────────────────────────────────────────────────────

const seed = async () => {
  const credentials = loadAdminCredentials()
  if (!credentials) return

  const { username, password, email } = credentials

  if (await adminAlreadyExists(username)) {
    console.log(`✅ Admin "${username}" já existe — nada a fazer.`)
    return
  }

  const user = await createAdminUser(email, username, password)
  await createAdminProfile(username, user.id)

  console.log(`✅ Admin "${username}" criado com sucesso.`)
}

seed()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
