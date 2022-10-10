import express from 'express'
import auth from '../../../middlewares/auth'
import index from '../../../controllers/products/index'
import create from '../../../controllers/products/create'
import show from '../../../controllers/products/show'

const routes = express.Router()

routes.get('/:id', show)
routes.get('/', index)
routes.post('/', auth, create)

export default routes
