import { Router } from 'express'
import { check } from 'express-validator'
import { registro, login } from '../controllers/auth.js'
import { correoNoExiste, telefonoNoExiste } from '../helpers/dbValidators.js'
import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()

router.post('/registro', [
  check('nombre', 'El nombre es obligatorio').trim().notEmpty(),
  check('correo', 'El correo no es valido').trim().toLowerCase().isEmail(),
  check('correo').custom(correoNoExiste),
  check('telefono', 'El telefono debe tener entre 7 y 10 digitos').trim().matches(/^\d{7,10}$/),
  check('telefono').custom(telefonoNoExiste),
  check('password', 'La contrasena debe tener minimo 6 caracteres').isLength({ min: 6 }),
  validarCampos
], registro)

router.post('/login', [
  check('acceso', 'Ingrese su correo o telefono').trim().toLowerCase().notEmpty(),
  check('password', 'La contrasena es obligatoria').notEmpty(),
  validarCampos
], login)

export default router
