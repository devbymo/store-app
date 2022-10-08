import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

export const generateAuthTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN
  const token = jwt.sign({ userId }, jwtSecret as string, { expiresIn })
  return token
}

export default generateAuthTokens
