import expres from 'express'
import userRoutes from './api/v1/usersRoutes'

const routes = expres.Router()

routes.use('/v1/users', userRoutes)

export default routes
