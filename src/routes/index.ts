import expres from 'express'
import userRoutes from './api/v1/usersRoutes'
import productRoutes from './api/v1/productsRoutes'
import orderRoutes from './api/v1/ordersRoutes'

const routes = expres.Router()

routes.use('/v1/users', userRoutes)
routes.use('/v1/products', productRoutes)
routes.use('/v1/orders', orderRoutes)

export default routes
