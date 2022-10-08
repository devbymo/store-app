import HttpError from '../models/httpError'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const saltRounds = Number(process.env.SALT_ROUNDS)
const pepper = process.env.BCRYPT_PASSWORD_PEPPER

const hashingPassword = async (password: string) => {
  try {
    const hash = bcrypt.hashSync(`${password}${pepper}`, saltRounds)
    return hash
  } catch (error) {
    throw new HttpError(`Something went wrong, could not create user. ${error}`, 500)
  }
}

export default hashingPassword
