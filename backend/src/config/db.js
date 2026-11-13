import dns from 'dns'
import mongoose from 'mongoose'

// DNS publico para que funcione mongodb+srv
dns.setServers(['8.8.8.8', '1.1.1.1'])

export const conectarDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB conectado')
}
