import jwt from 'jsonwebtoken'
import { prisma } from '../config/database.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' })
    }
    return res.status(500).json({ error: 'Erro ao autenticar token' })
  }
}

