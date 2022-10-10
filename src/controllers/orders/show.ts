import Order from '../../models/order'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

const order = new Order()

const show = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { status } = req.body

  // Check if id is provided
  if (!id) {
    const mes = 'id is required'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Id must be string
  if (typeof id !== 'string') {
    const mes = 'id must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate id
  if (!validator.isUUID(id)) {
    const mes = 'invalid id'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Check if status is provided
  if (!status) {
    const mes = 'status is required'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Status must be string
  if (typeof status !== 'string') {
    const mes = 'status must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate status
  if (!validator.isIn(status, ['active', 'completed'])) {
    const mes = 'invalid status'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  try {
    const result = await order.show(id, status || 'active')
    // Check if result is empty
    if (!result.length) {
      const mes = 'there is no orders for this user id'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(200).json({
      message: 'order found',
      status: 'success',
      data: {
        orders: result,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default show
