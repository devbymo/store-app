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

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from the header
    const token = req.headers.authorization?.replace('Bearer ', '')
    // Check if token exists
    if (!token) {
      throw new HttpError('authorization denied', 401)
    }
    // Verify token
    const jwtSecret = process.env.JWT_SECRET
    const decoded = jwt.verify(token, jwtSecret as string) as Decoded
    // Check if decoded token exists
    if (!decoded) {
      throw new HttpError('authorization denied', 401)
    }
    // Add user to the request to be used in the controllers and routes [that means all the routes that use this middleware will have access to the user id in the request]
    ;(req as REQ).userId = decoded.userId
    // Forward the request
    next()
  } catch (error) {
    const mes = 'authorization denied'
    const statusCode = 401
    return next(new HttpError(mes, statusCode))
  }
}

export default auth
