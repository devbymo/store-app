import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import HttpError from '../models/http-error'

dotenv.config()

export const generateAuthTokens = (userId: string) => {
  try {
    const jwtSecret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN
  const token = jwt.sign({ userId }, jwtSecret as string, { expiresIn })
  return token
  } catch (error) {
    throw new HttpError('Something went wrong, please try again later', 500)
  }
}

export default generateAuthTokens
