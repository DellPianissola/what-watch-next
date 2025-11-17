import express from 'express'

const router = express.Router()

// GET /api/profiles - Lista todos os perfis
router.get('/', (req, res) => {
  // TODO: Implementar busca de perfis
  res.json({ profiles: [] })
})

// GET /api/profiles/:id - Busca perfil por ID
router.get('/:id', (req, res) => {
  // TODO: Implementar busca por ID
  res.json({ profile: null })
})

// POST /api/profiles - Cria novo perfil
router.post('/', (req, res) => {
  // TODO: Implementar criação de perfil
  res.json({ message: 'Perfil criado com sucesso', profile: req.body })
})

// PUT /api/profiles/:id - Atualiza perfil
router.put('/:id', (req, res) => {
  // TODO: Implementar atualização
  res.json({ message: 'Perfil atualizado com sucesso' })
})

export default router

