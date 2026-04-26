import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import * as authService from '../services/auth.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body)
  res.status(201).json({ message: 'Usuário criado com sucesso', ...result })
}))

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body)
  res.json({ message: 'Login realizado com sucesso', ...result })
}))

// GET /api/auth/me
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id)
  res.json({ user })
}))

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  const tokens = await authService.refreshTokens(refreshToken)
  res.json(tokens)
}))

export default router
