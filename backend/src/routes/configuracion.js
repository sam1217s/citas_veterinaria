import { Router } from 'express'
import { check } from 'express-validator'
import { obtener, editar } from '../controllers/configuracion.js'
import { horarioValido } from '../helpers/configuracion.js'
import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/

router.get('/', obtener)

router.put('/', [
  check('nombreNegocio', 'El nombre del negocio es obligatorio').trim().notEmpty(),
  check('intervalo', 'El intervalo debe ser 15, 20, 30 o 60 minutos').isIn([15, 20, 30, 60]).toInt(),
  check('horario', 'El horario debe tener los 7 dias').isArray({ min: 7, max: 7 }),
  check('horario.*.dia', 'Dia no valido').isInt({ min: 0, max: 6 }),
  check('horario.*.activo', 'Valor no valido').isBoolean(),
  check('horario.*.inicio', 'Hora de inicio no valida').matches(HORA),
  check('horario.*.fin', 'Hora de cierre no valida').matches(HORA),
  check('horario').custom(horarioValido),
  validarCampos
], editar)

export default router
