import { Router } from 'express'
import { check } from 'express-validator'
import { listar, agregar, editar, eliminar } from '../controllers/citas.js'
import { existeCita, existeMascota, existeServicio, horarioDisponible } from '../helpers/dbValidators.js'
import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()

const campos = [
  check('mascota', 'La mascota es obligatoria').isMongoId(),
  check('mascota').custom(existeMascota),
  check('servicio', 'El servicio es obligatorio').isMongoId(),
  check('servicio').custom(existeServicio),
  check('fecha', 'La fecha debe tener formato AAAA-MM-DD').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('hora', 'La hora debe tener formato HH:MM').matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  check('hora').custom(horarioDisponible),
  check('motivo').optional().trim(),
  check('estado', 'Estado no valido').optional().isIn(['pendiente', 'atendida', 'cancelada'])
]

const id = [
  check('id', 'Id no valido').isMongoId(),
  check('id').custom(existeCita)
]

router.get('/', listar)
router.post('/', [...campos, validarCampos], agregar)
router.put('/:id', [...id, ...campos, validarCampos], editar)
router.delete('/:id', [...id, validarCampos], eliminar)

export default router
