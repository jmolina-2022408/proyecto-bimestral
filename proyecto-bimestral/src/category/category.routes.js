'use strict'

import { Router } from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from './category.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createCategory', [validateJwt], [isAdmin], createCategory)
api.get('/getAllCategories', [validateJwt], getAllCategories)
api.put('/updateCategory/:id', [validateJwt], [isAdmin], updateCategory)
api.delete('/deleteCategory/:id', [validateJwt], [isAdmin], deleteCategory)

export default api