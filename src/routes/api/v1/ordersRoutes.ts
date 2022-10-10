import express from 'express'
import auth from '../../../middlewares/auth'
import show from '../../../controllers/orders/show'
import cretae from '../../../controllers/orders/create'

const routes = express.Router()

routes.get('/user/:id', auth, show)
routes.post('/', auth, cretae)

export default routes
