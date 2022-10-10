import ProductModel from '../../models/product'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

const product = new ProductModel()

const show = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

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

  try {
    const result = await product.show(id)
    // check if resutl exists
    if (!result) {
      const mes = 'product not found'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(200).json({
      message: 'product found',
      status: 'success',
      data: {
        product: result,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default show
