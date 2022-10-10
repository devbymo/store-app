import client from '../db/postgresDB'
import User from '../types/user'
import HttpError from '../models/httpError'
import hashingPassword from '../utils/passwordHashing'
import compareHashedPassword from '../utils/compareHashedPassword'

// Create model class for User
export class UserModel {
  // Index method
  async index(): Promise<User[]> {
    // connect to database
    let connection
    try {
      connection = await client.connect()
    } catch (error) {
      const mes = `Could not connect to database. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
    // query database
    try {
      const sql = 'SELECT * FROM users'
      const result = await client.query(sql)
      // release connection
      connection.release()
      return result.rows
    } catch (error) {
      const mes = `Could not get users. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }

  // Show method
  async show(id: string): Promise<User> {
    // connect to database
    let connection
    try {
      connection = await client.connect()
    } catch (error) {
      const mes = `Could not connect to database. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
    // query database
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const result = await client.query(sql, [id])
      // release connection
      connection.release()
      return result.rows[0]
    } catch (error) {
      const mes = `Could not get user. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }

  // Create method
  async create(user: User): Promise<User> {
    // connect to database
    let connection
    try {
      connection = await client.connect()
    } catch (error) {
      const mes = `Could not connect to database. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
    // query database
    try {
      const sql =
        'INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *'
      // hash password
      const hashedPassword = await hashingPassword(user.password)
      const result = await client.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        hashedPassword,
      ])
      // release connection
      connection.release()
      return result.rows[0]
    } catch (error) {
      const mes = `Could not create user. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }

  // authenticate method
  async authenticate(email: string, password: string): Promise<User> {
    // connect to database
    let connection
    try {
      connection = await client.connect()
    } catch (error) {
      const mes = `Could not connect to database. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
    // query database
    try {
      const sql = 'SELECT * FROM users WHERE email=($1)'
      const result = await client.query(sql, [email])
      // release connection
      connection.release()
      // check if user exists
      if (result.rows.length === 0) {
        const mes = 'authentication failed'
        const statusCode = 404
        throw new HttpError(mes, statusCode)
      }
      // compare password
      const user = result.rows[0]
      const isPasswordValid = await compareHashedPassword(password, user.password)
      if (!isPasswordValid) {
        const mes = 'authentication failed'
        const statusCode = 401
        throw new HttpError(mes, statusCode)
      }
      return user
    } catch (error) {
      const mes = `Could not authenticate user. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }
}

// Export the model
export default UserModel
