import client from '../db/postgresDB'
import Order from '../types/order'
import HttpError from '../models/httpError'

// Create model class for Order
export class OrderModel {
  // Get current order by user id
  async show(userId: string, status: string): Promise<Order[]> {
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
        'SELECT p.name, p.price, op.quantity, o.status FROM products p INNER JOIN order_products op ON p.id = op.product_id INNER JOIN orders o ON op.order_id = o.id WHERE o.user_id = $1 AND o.status = $2'
      const result = await client.query(sql, [userId, status])
      // release connection
      connection.release()
      return result.rows
    } catch (error) {
      const mes = `Could not get order. ${(error as HttpError).message}`
      const statusCode = 404
      throw new HttpError(mes, statusCode)
    }
  }

  // Create new order
  async create(
    userId: string,
    productId: string,
    quantity: number,
    status: string
  ): Promise<Order> {
    // connect to database
    let connection
    try {
      connection = await client.connect()
    } catch (error) {
      const mes = `Could not connect to database. ${(error as HttpError).message}`
      const statusCode = (error as HttpError).statusCode || 500
      throw new HttpError(mes, statusCode)
    }
    // Check if user exists
    try {
      const sql = 'SELECT * FROM users WHERE id = $1'
      const result = await client.query(sql, [userId])
      if (result.rows.length === 0) {
        const mes = `User does not exist ${userId}`
        const statusCode = 404
        throw new HttpError(mes, statusCode)
      }
    } catch (error) {
      const mes = (error as HttpError).message
      const statusCode = (error as HttpError).statusCode || 500
      throw new HttpError(mes, statusCode)
    }
    // Check if product exists
    try {
      const sql = 'SELECT * FROM products WHERE id = $1'
      const result = await client.query(sql, [productId])
      if (result.rows.length === 0) {
        const mes = `Product does not exist ${productId}`
        const statusCode = 404
        throw new HttpError(mes, statusCode)
      }
    } catch (error) {
      const mes = (error as HttpError).message
      const statusCode = (error as HttpError).statusCode || 500
      throw new HttpError(mes, statusCode)
    }
    // query database
    try {
      // Insert new order into orders table
      const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id'
      const result = await client.query(sql, [userId, status])
      // Add order_id and product_id to order_products table
      const orderId = result.rows[0].id
      const sql2 =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *'
      await client.query(sql2, [orderId, productId, quantity])
      // Retrieve order from database
      const sql3 =
        'SELECT P.name, P.price, OP.quantity, O.status FROM products P INNER JOIN order_products OP ON P.id = OP.product_id INNER JOIN orders O ON OP.order_id = O.id WHERE O.id = $1'
      const result3 = await client.query(sql3, [orderId])
      // release connection
      connection.release()
      return result3.rows[0]
    } catch (error) {
      const mes = `Could not create order. ${(error as HttpError).message}`
      const statusCode = 500
      throw new HttpError(mes, statusCode)
    }
  }
}

export default OrderModel
