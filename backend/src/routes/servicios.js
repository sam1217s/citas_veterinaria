import { Router } from 'express'
import { check } from 'express-validator'
import { listar, agregar, editar, eliminar } from '../controllers/servicios.js'
import { existeServicio, servicioNoRepetido, servicioSinCitas } from '../helpers/dbValidators.js'
import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()

const campos = [
  check('nombre', 'El nombre del servicio es obligatorio').trim().notEmpty(),
  check('nombre').custom(servicioNoRepetido),
  check('duracion', 'La duracion debe estar entre 5 y 480 minutos').isInt({ min: 5, max: 480 }).toInt(),
  check('activo', 'Valor no valido').optional().isBoolean()
]

const id = [
  check('id', 'Id no valido').isMongoId(),
  check('id').custom(existeServicio)
]

router.get('/', listar)
router.post('/', [...campos, validarCampos], agregar)
router.put('/:id', [...id, ...campos, validarCampos], editar)
router.delete('/:id', [...id, check('id').custom(servicioSinCitas), validarCampos], eliminar)

export default router
