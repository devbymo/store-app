import express from 'express'
import index from '../../../controllers/users'
import create from '../../../controllers/users/create'
import login from '../../../controllers/users/login'
import auth from '../../../middlewares/auth'

const routes = express.Router()

routes.get('/', index)
routes.post('/', create)
routes.post('/login', login)

export default routes
