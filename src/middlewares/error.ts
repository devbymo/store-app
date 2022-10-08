import { Request, Response, NextFunction } from 'express'

interface Error {
  statusCode?: number
  message?: string
}

const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Check if response is already sent
  if (res.headersSent) {
    return next(err)
  }

  // Set status code and send error message
  const statusCode = err.statusCode || 500
  const message = err.message || 'Something went wrong!'

  // Return the error
  res.status(statusCode)
  res.json({ message, status: 'error' })
}

export default error
