import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✅ PostgreSQL conectado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export { prisma }
export default connectDB

