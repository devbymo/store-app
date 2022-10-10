import UserModel from '../../models/user'
import User from '../../types/user'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'
import generateAuthTokens from '../../utils/generateAuthTokens'
import validator from 'validator'

const user = new UserModel()

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, first_name, last_name } = req.body

  // Check if email & password & first_name & last_name are provided
  if (!email || !password || !first_name || !last_name) {
    const mes = 'email, password, first_name and last_name are required'
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

  // First name must be string
  if (typeof first_name !== 'string') {
    const mes = 'first_name must be string'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Last name must be string
  if (typeof last_name !== 'string') {
    const mes = 'last_name must be string'
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

  // Validate first name
  if (!validator.isLength(first_name, { min: 3, max: 30 })) {
    const mes = 'first_name must be at least 3 characters'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  // Validate last name
  if (!validator.isLength(last_name, { min: 3, max: 30 })) {
    const mes = 'last_name must be at least 3 characters'
    const statusCode = 400
    return next(new HttpError(mes, statusCode))
  }

  const newUser: User = {
    email,
    password,
    first_name,
    last_name,
  }

  try {
    const result = await user.create(newUser)
    // If user is not found
    if (!result) {
      const mes = 'unable to create user'
      const statusCode = 500
      return next(new HttpError(mes, statusCode))
    }
    // generate token
    const token = generateAuthTokens(result.id as string)
    res.status(201).json({
      message: 'User created',
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

export default create
