import { Router } from 'express'
import { check } from 'express-validator'
import { listar, agregar, editar, eliminar } from '../controllers/mascotas.js'
import { existeMascota, mascotaSinCitas } from '../helpers/dbValidators.js'
import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()

const campos = [
  check('nombre', 'El nombre es obligatorio').trim().notEmpty(),
  check('especie', 'La especie es obligatoria').trim().notEmpty(),
  check('edad', 'La edad debe ser un numero entre 0 y 50').optional().isInt({ min: 0, max: 50 }),
  check('dueno', 'El dueno es obligatorio').trim().notEmpty(),
  check('telefono', 'El telefono debe tener entre 7 y 10 digitos').matches(/^\d{7,10}$/)
]

const id = [
  check('id', 'Id no valido').isMongoId(),
  check('id').custom(existeMascota)
]

router.get('/', listar)
router.post('/', [...campos, validarCampos], agregar)
router.put('/:id', [...id, ...campos, validarCampos], editar)
router.delete('/:id', [...id, check('id').custom(mascotaSinCitas), validarCampos], eliminar)

export default router
