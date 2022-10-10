import UserModel from '../../models/user'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'
import generateAuthTokens from '../../utils/generateAuthTokens'
import validator from 'validator'

const user = new UserModel()

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Check if email and password are provided
  if (!email || !password) {
    const mes = 'email and password are required'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Email must be string
  if (typeof email !== 'string') {
    const mes = 'email must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Password must be string
  if (typeof password !== 'string') {
    const mes = 'password must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate email
  if (!validator.isEmail(email)) {
    const mes = 'invalid email'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate password
  if (!validator.isLength(password, { min: 3, max: 30 })) {
    const mes = 'password must be at least 3 characters'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  try {
    const result = await user.authenticate(email, password)
    // If user is not found
    if (!result) {
      const mes = 'unauthorized'
      const statusCode = 401
      return next(new HttpError(mes, statusCode))
    }
    // generate token
    const token = generateAuthTokens(result.id as string)

    res.status(200).json({
      message: 'User authenticated',
      status: 'success',
      data: {
        user: result,
        token,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default authenticate
