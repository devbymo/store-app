import { NextFunction, Request, Response } from 'express'
import HttpError from '../models/httpError'

const routeNotFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError('Route not found!', 404))
}

export default routeNotFound
