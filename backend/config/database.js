import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/whatwatchnext'
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ MongoDB conectado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB

