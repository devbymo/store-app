import client from '../db/postgresDB'
import Product from '../types/product'
import HttpError from '../models/httpError'

// Create model class for Product
export class ProductModel {
  // Index method
  async index(): Promise<Product[]> {
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
      const sql = 'SELECT * FROM products'
      const result = await client.query(sql)
      // release connection
      connection.release()
      return result.rows
    } catch (error) {
      const mes = `Could not get products. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }

  // Show method
  async show(id: string): Promise<Product> {
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
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await client.query(sql, [id])
      // release connection
      connection.release()
      return result.rows[0]
    } catch (error) {
      const mes = `Could not get product. ${(error as HttpError).message}`
      const statusCode = 404
      throw new HttpError(mes, statusCode)
    }
  }

  // Create method
  async create(product: Product): Promise<Product> {
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
      const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *'
      const result = await client.query(sql, [product.name, product.price, product.category])
      // release connection
      connection.release()
      return result.rows[0]
    } catch (error) {
      const mes = `Could not create product. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }
}

export default ProductModel
