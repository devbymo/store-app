import express from 'express'
import auth from '../../../middlewares/auth'
import index from '../../../controllers/users/index'
import create from '../../../controllers/users/create'
import show from '../../../controllers/users/show'
import authenticate from '../../../controllers/users/authenticate'

const routes = express.Router()

routes.get('/:id', auth, show)
routes.get('/', auth, index)
routes.post('/', create)
routes.post('/authenticate', authenticate)

export default routes
