import jwt from 'jsonwebtoken'

export const generarJWT = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' })
