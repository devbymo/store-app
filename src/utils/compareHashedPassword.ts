import HttpError from '../models/httpError'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const compareHashedPassword = async (password: string, hash: string) => {
  try {
    const pepper = process.env.BCRYPT_PASSWORD_PEPPER
    const isValid = bcrypt.compareSync(`${password}${pepper}`, hash)
    return isValid
  } catch (error) {
    throw new HttpError(`Something went wrong, could not login. ${error}`, 500)
  }
}

export default compareHashedPassword
