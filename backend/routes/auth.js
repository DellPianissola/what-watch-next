import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database.js'

const router = express.Router()

// POST /api/auth/register - Registra novo usuário
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body

    // Validações
    if (!email || !username || !password) {
      return res.status(400).json({ 
        error: 'Email, nome de usuário e senha são obrigatórios' 
      })
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    // Validação de senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Senha deve ter no mínimo 6 caracteres' 
      })
    }

    // Verifica se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    // Verifica se username já existe
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return res.status(400).json({ error: 'Nome de usuário já cadastrado' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })

    // Cria o perfil automaticamente
    const profile = await prisma.profile.create({
      data: {
        name: username,
        userId: user.id,
      },
    })

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      profile,
      token,
    })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário', details: error.message })
  }
})

// POST /api/auth/login - Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validações
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      })
    }

    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      token,
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({ error: 'Erro ao fazer login', details: error.message })
  }
})

// GET /api/auth/me - Retorna dados do usuário autenticado
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: {
          include: {
            _count: {
              select: { movies: true },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json({ user })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' })
    }
    return res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

export default router

