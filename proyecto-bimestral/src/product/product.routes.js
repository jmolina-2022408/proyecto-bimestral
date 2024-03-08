'use strict'

import { Router } from 'express'
import { addStock, createProduct, deleteProduct, getAllProducts, getBestSelling, getOutOfStock, getProduct, getProductsByCategory, updateProduct } from './product.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createProduct', [validateJwt], [isAdmin], createProduct)
api.get('/getAllProducts', [validateJwt], getAllProducts)
api.post('/getProduct', [validateJwt], getProduct)
api.put('/updateProduct/:id', [validateJwt], [isAdmin], updateProduct)
api.get('/getOutOfStock', [validateJwt], getOutOfStock)
api.get('/getBestSelling', [validateJwt], getBestSelling)
api.get('/getProductsByCategory/:id', [validateJwt], getProductsByCategory)
api.delete('/deleteProduct/:id', [validateJwt], [isAdmin], deleteProduct)
api.put('/addStock/:id', [validateJwt], [isAdmin], addStock)

export default api