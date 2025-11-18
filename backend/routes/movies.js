import express from 'express'
import { prisma } from '../config/database.js'

const router = express.Router()

// GET /api/movies - Lista todos os filmes, séries e animes
router.get('/', async (req, res) => {
  try {
    const { profileId, type, watched } = req.query
    
    const where = {}
    
    if (profileId) {
      where.addedById = profileId
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }
    
    if (watched !== undefined) {
      where.watched = watched === 'true'
    }
    
    const movies = await prisma.movie.findMany({
      where,
      include: {
        addedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    
    res.json({ movies })
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    res.status(500).json({ error: 'Erro ao buscar filmes' })
  }
})

// POST /api/movies - Adiciona novo filme, série ou anime
router.post('/', async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      poster,
      year,
      duration,
      genres = [],
      rating,
      priority = 'MEDIUM',
      isNew = false,
      externalId,
      addedById, // ID do perfil que está adicionando
    } = req.body

    // Validações
    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }

    if (!type || !['MOVIE', 'SERIES', 'ANIME'].includes(type.toUpperCase())) {
      return res.status(400).json({ error: 'Tipo inválido. Use: MOVIE, SERIES ou ANIME' })
    }

    if (!addedById) {
      return res.status(400).json({ error: 'ID do perfil (addedById) é obrigatório' })
    }

    // Verifica se o perfil existe
    const profile = await prisma.profile.findUnique({
      where: { id: addedById },
    })

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    // Converte rating para Decimal se fornecido
    let ratingDecimal = null
    if (rating !== undefined && rating !== null) {
      ratingDecimal = parseFloat(rating)
      if (isNaN(ratingDecimal) || ratingDecimal < 0 || ratingDecimal > 10) {
        return res.status(400).json({ error: 'Rating deve ser um número entre 0 e 10' })
      }
    }

    // Cria o filme
    const movie = await prisma.movie.create({
      data: {
        title,
        type: type.toUpperCase(),
        description: description || null,
        poster: poster || null,
        year: year ? parseInt(year) : null,
        duration: duration ? parseInt(duration) : null,
        genres: Array.isArray(genres) ? genres : [],
        rating: ratingDecimal,
        priority: priority.toUpperCase(),
        isNew: Boolean(isNew),
        externalId: externalId || null,
        addedById,
      },
      include: {
        addedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    res.status(201).json({
      message: 'Filme adicionado com sucesso',
      movie,
    })
  } catch (error) {
    console.error('Erro ao criar filme:', error)
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Filme já existe' })
    }
    
    res.status(500).json({ error: 'Erro ao criar filme', details: error.message })
  }
})

// GET /api/movies/:id - Busca filme por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        addedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    res.json({ movie })
  } catch (error) {
    console.error('Erro ao buscar filme:', error)
    res.status(500).json({ error: 'Erro ao buscar filme' })
  }
})

// PUT /api/movies/:id - Atualiza filme
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      type,
      description,
      poster,
      year,
      duration,
      genres,
      rating,
      priority,
      isNew,
      watched,
      watchedAt,
    } = req.body

    // Verifica se o filme existe
    const existingMovie = await prisma.movie.findUnique({
      where: { id },
    })

    if (!existingMovie) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    // Prepara dados para atualização
    const updateData = {}

    if (title !== undefined) updateData.title = title
    if (type !== undefined) updateData.type = type.toUpperCase()
    if (description !== undefined) updateData.description = description
    if (poster !== undefined) updateData.poster = poster
    if (year !== undefined) updateData.year = year ? parseInt(year) : null
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null
    if (genres !== undefined) updateData.genres = Array.isArray(genres) ? genres : []
    if (rating !== undefined) {
      if (rating === null) {
        updateData.rating = null
      } else {
        const ratingDecimal = parseFloat(rating)
        if (isNaN(ratingDecimal) || ratingDecimal < 0 || ratingDecimal > 10) {
          return res.status(400).json({ error: 'Rating deve ser um número entre 0 e 10' })
        }
        updateData.rating = ratingDecimal
      }
    }
    if (priority !== undefined) updateData.priority = priority.toUpperCase()
    if (isNew !== undefined) updateData.isNew = Boolean(isNew)
    if (watched !== undefined) {
      updateData.watched = Boolean(watched)
      if (watched && !watchedAt) {
        updateData.watchedAt = new Date()
      } else if (!watched) {
        updateData.watchedAt = null
      }
    }
    if (watchedAt !== undefined) updateData.watchedAt = watchedAt ? new Date(watchedAt) : null

    const movie = await prisma.movie.update({
      where: { id },
      data: updateData,
      include: {
        addedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    res.json({
      message: 'Filme atualizado com sucesso',
      movie,
    })
  } catch (error) {
    console.error('Erro ao atualizar filme:', error)
    res.status(500).json({ error: 'Erro ao atualizar filme' })
  }
})

// DELETE /api/movies/:id - Remove filme
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const movie = await prisma.movie.findUnique({
      where: { id },
    })

    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    await prisma.movie.delete({
      where: { id },
    })

    res.json({ message: 'Filme removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover filme:', error)
    res.status(500).json({ error: 'Erro ao remover filme' })
  }
})

export default router

