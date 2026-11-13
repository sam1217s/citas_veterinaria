import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { conectarDB } from './config/db.js'
import { validarJWT } from './middlewares/validarJWT.js'
import auth from './routes/auth.js'
import mascotas from './routes/mascotas.js'
import citas from './routes/citas.js'
import configuracion from './routes/configuracion.js'
import servicios from './routes/servicios.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/mascotas', validarJWT, mascotas)
app.use('/api/citas', validarJWT, citas)
app.use('/api/configuracion', validarJWT, configuracion)
app.use('/api/servicios', validarJWT, servicios)

conectarDB()
  .then(() => app.listen(process.env.PORT, () => console.log(`Servidor en http://localhost:${process.env.PORT}`)))
  .catch((error) => console.log('Error al conectar MongoDB:', error.message))
