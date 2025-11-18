import express from 'express'
import { prisma } from '../config/database.js'

const router = express.Router()

// GET /api/profiles - Lista todos os perfis
router.get('/', async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        _count: {
          select: {
            movies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({ profiles })
  } catch (error) {
    console.error('Erro ao buscar perfis:', error)
    res.status(500).json({ error: 'Erro ao buscar perfis' })
  }
})

// POST /api/profiles - Cria novo perfil
router.post('/', async (req, res) => {
  try {
    const { name, avatar } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' })
    }

    const profile = await prisma.profile.create({
      data: {
        name,
        avatar: avatar || null,
      },
    })

    res.status(201).json({
      message: 'Perfil criado com sucesso',
      profile,
    })
  } catch (error) {
    console.error('Erro ao criar perfil:', error)
    res.status(500).json({ error: 'Erro ao criar perfil' })
  }
})

// GET /api/profiles/:id - Busca perfil por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        movies: {
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
        },
        _count: {
          select: {
            movies: true,
          },
        },
      },
    })

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    res.json({ profile })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ error: 'Erro ao buscar perfil' })
  }
})

// PUT /api/profiles/:id - Atualiza perfil
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, avatar } = req.body

    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    })

    if (!existingProfile) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (avatar !== undefined) updateData.avatar = avatar

    const profile = await prisma.profile.update({
      where: { id },
      data: updateData,
    })

    res.json({
      message: 'Perfil atualizado com sucesso',
      profile,
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }
})

export default router

