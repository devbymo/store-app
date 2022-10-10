import UserModel from '../../models/user'
import HttpError from '../../models/httpError'
import { Request, Response, NextFunction } from 'express'

const user = new UserModel()

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await user.index()
    // check if result is empty
    if (result.length === 0) {
      const mes = 'no users found'
      const statusCode = 404
      return next(new HttpError(mes, statusCode))
    }
    res.status(200).json({
      message: 'users found',
      status: 'success',
      data: {
        users: result,
      },
    })
  } catch (error) {
    const mes = (error as HttpError).message
    const statusCode = (error as HttpError).statusCode
    next(new HttpError(mes, statusCode))
  }
}

export default index
