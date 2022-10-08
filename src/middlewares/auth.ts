import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import HttpError from '../models/httpError'

interface REQ extends Request {
  userId?: string
}

interface Decoded {
  userId: string
  iat: number
  exp: number
}

const auth = (req: REQ, res: Response, next: NextFunction) => {
  try {
    // Get token from the header
    const token = req.headers.authorization?.replace('Bearer ', '')

    // Check if token exists
    if (!token) {
      throw new HttpError('No token, authorization denied', 401)
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET
    const decoded: Decoded = jwt.verify(token, jwtSecret as string) as Decoded

    // Add user to the request to be used in the controller
    req.userId = decoded.userId

    // Forward the request
    next()
  } catch (error) {
    const mes = (error as HttpError).message || 'Something went wrong, could not login'
    const statusCode = (error as HttpError).statusCode || 500
    return next(new HttpError(mes, statusCode))
  }
}

export default auth
