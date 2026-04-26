import express from 'express'
import { asyncHandler } from '../lib/asyncHandler.js'
import * as profilesService from '../services/profiles.js'

const router = express.Router()

// GET /api/profiles - Retorna o perfil do usuário autenticado
router.get('/', asyncHandler(async (req, res) => {
  const profile = await profilesService.getProfile(req.user.id)
  res.json({ profile })
}))

// POST /api/profiles - Cria perfil para o usuário autenticado (se não existir)
router.post('/', asyncHandler(async (req, res) => {
  const profile = await profilesService.createProfile(req.user.id, req.user.username, req.body)
  res.status(201).json({ message: 'Perfil criado com sucesso', profile })
}))

// GET /api/profiles/me - Retorna perfil do usuário autenticado com filmes
router.get('/me', asyncHandler(async (req, res) => {
  const profile = await profilesService.getProfileWithMovies(req.user.id)
  res.json({ profile })
}))

// PUT /api/profiles - Atualiza perfil do usuário autenticado
router.put('/', asyncHandler(async (req, res) => {
  const profile = await profilesService.updateProfile(req.user.id, req.body)
  res.json({ message: 'Perfil atualizado com sucesso', profile })
}))

// POST /api/profiles/onboarded - Marca o onboarding como concluído (idempotente)
router.post('/onboarded', asyncHandler(async (req, res) => {
  const { profile, alreadyCompleted } = await profilesService.markOnboarded(req.user.id)
  res.json({
    message: alreadyCompleted ? 'Onboarding já estava concluído' : 'Onboarding concluído',
    profile,
  })
}))

export default router
