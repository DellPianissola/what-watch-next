import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
  return { accessToken, refreshToken }
}

const validateRegistrationInput = (email, username, password) => {
  if (!email || !username || !password) {
    return 'Email, nome de usuário e senha são obrigatórios'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Email inválido'
  }
  if (password.length < 6) {
    return 'Senha deve ter no mínimo 6 caracteres'
  }
  return null
}

const checkEmailAlreadyExists = async (email) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  return !!existing
}

const checkUsernameAlreadyExists = async (username) => {
  const existing = await prisma.user.findUnique({ where: { username } })
  return !!existing
}

const createUser = async (email, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { email, username, password: hashedPassword },
    select: { id: true, email: true, username: true, createdAt: true },
  })
}

const createProfile = async (username, userId) => {
  return prisma.profile.create({
    data: { name: username, userId },
  })
}

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })
}

const validatePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed)
}

const findUserWithProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      profile: {
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { movies: true } },
        },
      },
    },
  })
}

const decodeRefreshToken = (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
  if (decoded.type !== 'refresh') {
    throw new Error('Token inválido')
  }
  return decoded
}

const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  })
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body

    const validationError = validateRegistrationInput(email, username, password)
    if (validationError) return res.status(400).json({ error: validationError })

    if (await checkEmailAlreadyExists(email)) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }
    if (await checkUsernameAlreadyExists(username)) {
      return res.status(400).json({ error: 'Nome de usuário já cadastrado' })
    }

    const user = await createUser(email, username, password)
    const profile = await createProfile(username, user.id)
    const { accessToken, refreshToken } = generateTokens(user.id, user.email)

    res.status(201).json({ message: 'Usuário criado com sucesso', user, profile, accessToken, refreshToken })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Email ou senha inválidos' })

    const passwordMatch = await validatePassword(password, user.password)
    if (!passwordMatch) return res.status(401).json({ error: 'Email ou senha inválidos' })

    const { accessToken, refreshToken } = generateTokens(user.id, user.email)

    res.json({
      message: 'Login realizado com sucesso',
      user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
      profile: user.profile,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserWithProfile(req.user.id)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token não fornecido' })

    const decoded = decodeRefreshToken(refreshToken)

    const user = await findUserById(decoded.userId)
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email)

    res.json({ accessToken, refreshToken: newRefreshToken })
  } catch (error) {
    res.status(401).json({ error: 'Refresh token inválido ou expirado' })
  }
})

export default router
