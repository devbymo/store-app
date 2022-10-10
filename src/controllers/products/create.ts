import ProductModel from '../../models/product'
import Product from '../../types/product'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'

const product = new ProductModel()

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category, price } = req.body

  // Check if name & category & price are provided
  if (!name || !category || !price) {
    const mes = 'name, category and price are required'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Name must be string
  if (typeof name !== 'string') {
    const mes = 'name must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Category must be string
  if (typeof category !== 'string') {
    const mes = 'category must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Price must be number
  if (typeof price !== 'number') {
    const mes = 'price must be number'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  const newProduct: Product = {
    name,
    price,
    category,
  }

  try {
    const result = await product.create(newProduct)
    // check if result is empty
    if (!result) {
      const mes = 'unable to create product'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(201).json({
      message: 'product created',
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

export default create
