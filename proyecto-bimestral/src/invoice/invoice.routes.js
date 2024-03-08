'use strict'

import { Router } from 'express'
import { createInvoice } from './invoice.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router();

api.post('/createInvoice/:id', [validateJwt], [isAdmin], createInvoice);

export default api;