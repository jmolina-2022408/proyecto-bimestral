'use strict'

import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { createCart, deleteCart, removeFromCart } from './cart.controller.js'

const api = Router()

api.post('/addToCart', [validateJwt], createCart)
api.delete('/removeFromCart/:id', [validateJwt], removeFromCart)
api.delete('/deleteCart', [validateJwt], deleteCart)

export default api