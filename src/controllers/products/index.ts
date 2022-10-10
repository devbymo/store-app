import ProductModel from '../../models/product'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'

const product = new ProductModel()

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await product.index()
    // check if result is empty
    if (result.length === 0) {
      const mes = 'no products found'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(200).json({
      message: 'products found',
      status: 'success',
      data: {
        products: result,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default index
