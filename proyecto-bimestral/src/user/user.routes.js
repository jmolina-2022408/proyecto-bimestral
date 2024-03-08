import express from 'express'
import { deleteProfile, login, register, shoppingHistory, updateProfile } from './user.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/register', register)
api.post('/login', login)
api.put('/updateProfile/:id', [validateJwt], [isAdmin], updateProfile)
api.delete('/deleteProfile/:id', [validateJwt], [isAdmin], deleteProfile)
api.get('/shoppingHistory', [validateJwt], shoppingHistory)

export default api