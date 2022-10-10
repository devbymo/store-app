import supertest from 'supertest'
import app from '../app'
import UserModel from '../models/user'
import OrderModel from '../models/order'
import ProductModel from '../models/product'
import User from '../types/user'
import Product from '../types/product'
import client from '../db/postgresDB'
import compareHashedPassword from '../utils/compareHashedPassword'
import generateAuthTokens from '../utils/generateAuthTokens'

const request = supertest(app)

const orderModel = new OrderModel()
const userModel = new UserModel()
const productModel = new ProductModel()
let token = ''

describe('User tests', () => {
  describe('Methods exits', () => {
    it('should have a create method', () => {
      expect(userModel.create).toBeDefined()
    })
    it('should have an index method', () => {
      expect(userModel.index).toBeDefined()
    })
    it('should have a show method', () => {
      expect(userModel.show).toBeDefined()
    })
    it('should have an authenticate method', () => {
      expect(userModel.authenticate).toBeDefined()
    })
  })
  describe('Methods logic', () => {
    const user = {
      email: 'mohamed@gmail.com',
      password: '123456',
      first_name: 'mohamed',
      last_name: 'yasser',
    } as User
    beforeAll(async () => {
      const newCreatedUser = await userModel.create(user)
      user.id = newCreatedUser.id
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM users'
      await connection.query(sql)
      connection.release()
    })
    it('should create a user', async () => {
      const user = {
        email: 'test@gmail.com',
        password: '123456',
        first_name: 'test',
        last_name: 'test',
      } as User
      const newCreatedUser = await userModel.create(user)
      user.id = newCreatedUser.id
      const isPasswordValid = compareHashedPassword(user.password, newCreatedUser.password)
      expect(newCreatedUser.id).toEqual(user.id)
      expect(newCreatedUser.email).toEqual(user.email)
      expect(newCreatedUser.first_name).toEqual(user.first_name)
      expect(newCreatedUser.last_name).toEqual(user.last_name)
      expect(isPasswordValid).toBeTruthy()
    })
    it('should index users', async () => {
      const users = await userModel.index()
      expect(users.length).toBe(2)
    })
    it('should show a user', async () => {
      const userData = await userModel.show(user.id as string)
      expect(userData.id).toEqual(user.id)
      expect(userData.email).toEqual(user.email)
      expect(userData.first_name).toEqual(user.first_name)
      expect(userData.last_name).toEqual(user.last_name)
    })
    it('should authenticate a user', async () => {
      const userData = await userModel.authenticate(user.email, user.password)
      expect(userData.id).toEqual(user.id)
      expect(userData.email).toEqual(user.email)
      expect(userData.first_name).toEqual(user.first_name)
      expect(userData.last_name).toEqual(user.last_name)
    })
  })
  describe('API Routes', () => {
    const user = {
      email: 'mohamed@gmail.com',
      password: '123456',
      first_name: 'mohamed',
      last_name: 'yasser',
    } as User
    beforeAll(async () => {
      const newCreatedUser = await userModel.create(user)
      user.id = newCreatedUser.id
      token = generateAuthTokens(user.id as string)
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM users'
      await connection.query(sql)
      connection.release()
    })
    it('/api/v1/users [POST]', async () => {
      const user = {
        email: 'test@test.test',
        password: '123456',
        first_name: 'mohamed',
        last_name: 'yasser',
      } as User
      const response = await request.post('/api/v1/users').send(user)
      user.id = response.body.data.user.id
      const isPasswordValid = await compareHashedPassword(
        user.password,
        response.body.data.user.password
      )
      expect(response.status).toBe(201)
      expect(response.body.data.user.id).toBe(user.id)
      expect(response.body.data.user.email).toBe(user.email)
      expect(response.body.data.user.first_name).toBe(user.first_name)
      expect(response.body.data.user.last_name).toBe(user.last_name)
      expect(isPasswordValid).toBeTruthy()
    })
    it('/api/v1/users [GET]', async () => {
      // set token to request
      const response = await request
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
      expect(response.status).toBe(200)
      expect(response.body.data.users.length).toBe(2)
    })
    it('/api/v1/users/:userId [GET]', async () => {
      const response = await request
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
      expect(response.status).toBe(200)
      expect(response.body.data.user.id).toBe(user.id)
      expect(response.body.data.user.email).toBe(user.email)
      expect(response.body.data.user.first_name).toBe(user.first_name)
      expect(response.body.data.user.last_name).toBe(user.last_name)
    })
    it('/api/v1/users/authenticate [POST]', async () => {
      const response = await request.post('/api/v1/users/authenticate').send({
        email: user.email,
        password: user.password,
      })
      expect(response.status).toBe(200)
      expect(response.body.data.user.id).toBe(user.id)
      expect(response.body.data.user.email).toBe(user.email)
      expect(response.body.data.user.first_name).toBe(user.first_name)
      expect(response.body.data.user.last_name).toBe(user.last_name)
    })
  })
})

describe('Order tests', () => {
  describe('Methods exits', () => {
    it('should have a create method', () => {
      expect(orderModel.create).toBeDefined()
    })
    it('should have a show method', () => {
      expect(orderModel.show).toBeDefined()
    })
  })
  describe('Methods logic', () => {
    const user = {
      email: 'test@gmail.com',
      password: '123456',
      first_name: 'test',
      last_name: 'test',
    } as User
    const product = {
      name: 'test',
      price: 100,
      category: 'test',
    } as Product
    beforeAll(async () => {
      // create a user
      const newCreatedUser = await userModel.create(user)
      user.id = newCreatedUser.id
      // create a product
      const newCreatedProduct = await productModel.create(product)
      product.id = newCreatedProduct.id
      // create an order
      await orderModel.create(user.id as string, product.id as string, 99, 'active')
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM orders'
      const sql2 = 'DELETE FROM users'
      const sql3 = 'DELETE FROM products'
      await connection.query(sql)
      await connection.query(sql2)
      await connection.query(sql3)
      connection.release()
    })

    it('should create an order', async () => {
      // Create an order for testing
      const order = await orderModel.create(user.id as string, product.id as string, 99, 'active')
      expect(order.name).toBe(product.name)
      expect(order.price).toBe('100.00')
      expect(order.quantity).toBe(99)
    })
    it('should show an order', async () => {
      const orders = await orderModel.show(user.id as string, 'active')
      expect(orders.length).toBe(2)
    })
  })
  describe('API Routes', () => {
    const user = {
      email: 'test@gmail.com',
      password: '123456',
      first_name: 'test',
      last_name: 'test',
    } as User
    const product = {
      name: 'test',
      price: 100,
      category: 'test',
    } as Product
    beforeAll(async () => {
      // create a user
      const newCreatedUser = await userModel.create(user)
      user.id = newCreatedUser.id
      // create a product
      const newCreatedProduct = await productModel.create(product)
      product.id = newCreatedProduct.id
      // create an order
      await orderModel.create(user.id as string, product.id as string, 99, 'completed')
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM orders'
      const sql2 = 'DELETE FROM users'
      const sql3 = 'DELETE FROM products'
      await connection.query(sql)
      await connection.query(sql2)
      await connection.query(sql3)
      connection.release()
    })
    it('/api/v1/orders [POST]', async () => {
      const response = await request
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          userId: user.id,
          productId: product.id,
          quantity: 99,
          status: 'active',
        })
      expect(response.status).toBe(201)
      expect(response.body.data.order.name).toBe(product.name)
      expect(response.body.data.order.price).toBe('100.00')
      expect(response.body.data.order.quantity).toBe(99)
    })
    it('/api/v1/orders/user/:userId [GET] (ACTIVE)', async () => {
      const response = await request
        .get(`/api/v1/orders/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          status: 'active',
        })
      expect(response.status).toBe(200)
      expect(response.body.data.orders.length).toBe(1)
    })
    it('/api/v1/orders/user/:userId [GET] (COMPLETED)', async () => {
      const response = await request
        .get(`/api/v1/orders/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          status: 'completed',
        })
      expect(response.status).toBe(200)
      expect(response.body.data.orders.length).toBe(1)
    })
  })
})

describe('Product tests', () => {
  describe('Methods exits', () => {
    it('should have an index method', () => {
      expect(productModel.index).toBeDefined()
    })
    it('should have a show method', () => {
      expect(productModel.show).toBeDefined()
    })
    it('should have a create method', () => {
      expect(productModel.create).toBeDefined()
    })
  })
  describe('Methods logic', () => {
    const product = {
      name: 'test',
      price: 100,
      category: 'test',
    } as Product
    beforeAll(async () => {
      const newCreatedProduct = await productModel.create(product)
      product.id = newCreatedProduct.id
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM products'
      await connection.query(sql)
      connection.release()
    })
    it('should index products', async () => {
      const products = await productModel.index()
      expect(products.length).toBe(1)
    })
    it('should show a product', async () => {
      const productData = await productModel.show(product.id as string)
      expect(productData.id).toEqual(product.id)
      expect(productData.name).toEqual(product.name)
      expect(Math.abs(parseInt(productData.price as unknown as string))).toEqual(100)
      expect(productData.category).toEqual(product.category)
    })
    it('should create a product', async () => {
      const product = {
        name: 'test',
        price: 100,
        category: 'test',
      } as Product
      const newCreatedProduct = await productModel.create(product)
      product.id = newCreatedProduct.id
      expect(newCreatedProduct.id).toEqual(product.id)
      expect(newCreatedProduct.name).toEqual(product.name)
      expect(Math.abs(parseInt(newCreatedProduct.price as unknown as string))).toEqual(100)
      expect(newCreatedProduct.category).toEqual(product.category)
    })
  })
  describe('API Routes', () => {
    const product = {
      name: 'test',
      price: 100,
      category: 'test',
    } as Product
    beforeAll(async () => {
      const newCreatedProduct = await productModel.create(product)
      product.id = newCreatedProduct.id
    })
    afterAll(async () => {
      const connection = await client.connect()
      const sql = 'DELETE FROM products'
      await connection.query(sql)
      connection.release()
    })
    it('/api/v1/products [POST]', async () => {
      const response = await request
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          name: 'test',
          price: 100,
          category: 'test',
        })
      expect(response.status).toBe(201)
      expect(response.body.data.product.name).toBe('test')
      expect(response.body.data.product.price).toBe('100.00')
      expect(response.body.data.product.category).toBe('test')
    })
    it('/api/v1/products [GET]', async () => {
      const response = await request.get('/api/v1/products')
      expect(response.status).toBe(200)
      expect(response.body.data.products.length).toBe(2)
    })
    it('/api/v1/products/:id [GET]', async () => {
      const response = await request.get(`/api/v1/products/${product.id}`)
      expect(response.status).toBe(200)
      expect(response.body.data.product.name).toBe('test')
      expect(response.body.data.product.price).toBe('100.00')
      expect(response.body.data.product.category).toBe('test')
    })
  })
})
