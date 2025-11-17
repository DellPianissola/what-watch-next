import express from 'express'

const router = express.Router()

// GET /api/movies - Lista todos os filmes
router.get('/', (req, res) => {
  // TODO: Implementar busca de filmes
  res.json({ movies: [] })
})

// GET /api/movies/:id - Busca filme por ID
router.get('/:id', (req, res) => {
  // TODO: Implementar busca por ID
  res.json({ movie: null })
})

// POST /api/movies - Adiciona novo filme
router.post('/', (req, res) => {
  // TODO: Implementar criação de filme
  res.json({ message: 'Filme criado com sucesso', movie: req.body })
})

// PUT /api/movies/:id - Atualiza filme
router.put('/:id', (req, res) => {
  // TODO: Implementar atualização
  res.json({ message: 'Filme atualizado com sucesso' })
})

// DELETE /api/movies/:id - Remove filme
router.delete('/:id', (req, res) => {
  // TODO: Implementar remoção
  res.json({ message: 'Filme removido com sucesso' })
})

export default router

