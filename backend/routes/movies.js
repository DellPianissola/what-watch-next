import express from 'express'

const router = express.Router()

// GET /api/movies - Lista todos os filmes, séries e animes
router.get('/', (req, res) => {
  // TODO: Implementar busca de filmes
  res.json({ movies: [] })
})

// POST /api/movies - Adiciona novo filme, série ou anime
router.post('/', (req, res) => {
  // TODO: Implementar criação de filme
  res.json({ message: 'Filme criado com sucesso', movie: req.body })
})

// GET /api/movies/:id - Busca filme por ID
router.get('/:id', (req, res) => {
  // TODO: Implementar busca por ID
  res.json({ movie: null })
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

