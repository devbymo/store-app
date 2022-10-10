import Order from '../../models/order'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

const order = new Order()

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, productId, quantity, status } = req.body

  // Check if userId & productId & quantity & status are provided
  if (!userId || !productId || !quantity || !status) {
    const mes = 'userId, productId, quantity and status are required'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // userId must be string
  if (typeof userId !== 'string') {
    const mes = 'userId must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // productId must be string
  if (typeof productId !== 'string') {
    const mes = 'productId must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // quantity must be number
  if (typeof quantity !== 'number') {
    const mes = 'quantity must be number'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // status must be string
  if (typeof status !== 'string') {
    const mes = 'status must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate userId
  if (!validator.isUUID(userId)) {
    const mes = 'invalid userId'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate productId
  if (!validator.isUUID(productId)) {
    const mes = 'invalid productId'
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
    const result = await order.create(userId, productId, quantity, status)
    // check if resutl exists
    if (!result) {
      const mes = 'unable to create order'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(201).json({
      message: 'order created',
      status: 'success',
      data: {
        order: result,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default create
