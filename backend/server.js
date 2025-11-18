import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import connectDB from './config/database.js'
import indexRoutes from './routes/index.js'
import moviesRoutes from './routes/movies.js'
import profilesRoutes from './routes/profiles.js'
import externalRoutes from './routes/external.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'What Watch Next API - Documentação',
}))

// Connect to PostgreSQL
connectDB()

// Routes
app.use('/api', indexRoutes)
app.use('/api/movies', moviesRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/external', externalRoutes)

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`📚 Documentation available at http://localhost:${PORT}/docs`)
})

