# STORE APP API
## Getting started
**NOTE:** First of all you should have postgress DB, node.js installed locally in your PC

### Env required
**EX**
```
# ENV info
PORT=3000
NODE_ENV=dev
# DB connection info
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=store_dev
POSTGRES_DB_TEST=store_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=4755
# CORS config
CORS_ORIGIN=http://localhost:3000
# REQ limit
REQEST_LIMIT_TIMEOUT=900000
REQEST_NUMBER_LIMIT=100
# BCRYPT config
BCRYPT_SALT_ROUNDS=10
BCRYPT_PASSWORD_PEPPER=secret
# JWT config
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
```

### Installation Steps
`npm install`

### DB Creation
**NOTE:** You should create 2 databases locally in your PC
```
CREATE DATABASE store_dev;
CREATE DATABASE store_test;
```
### Run Migrations
* up migration
`npm run migration:up`
* down migration
`npm run migration:down`
* reset migration
`npm run migration:reset`

### Start Server (dev)
`npm run dev`

### Start Server (prod)
`npm run start`

### Clean
`npm run clean`

### Build the project
`npm run build`

### Format Code
`npm run format`

### Run ESLint
`npm run lint`

### Run Test
`npm run test`

## API endpoints
* Success response format
```
{
  "message": "order found",
  "status": "success",
  "data": ...
}
```
* Error response format
```
{
  "message": "authorization denied",
  "status": "error"
}
```
### Users
* Create new user `http://localhost:3000/api/v1/users [POST]` (generate token)
* Required:
1. Request Body
```
{
  "email": "mohamed@gmail.com",
  "password": "123456",
  "first_name": "Mohamed",
  "last_name": "Yasser"
}
```

* Authenticate user `http://localhost:3000/api/v1/users/authenticate [POST]` (generate token)
* Required:
1. Request Body
```
{
  "email": "mohamed@gmail.com",
  "password": "123456",
}
```

* Show user `http://localhost:3000/api/v1/users/:userId [GET]` (authentication required)
* Required:
1. Bearer Token `Bearer [token]`

* Index users `http://localhost:3000/api/v1/users [GET]` (authentication required)
* Required:
1. Bearer Token `Bearer [token]`

### Products
* Create product `http://localhost:3000/api/v1/products [POST]` (authentication required)
* Required:
1. Bearer Token `Bearer [token]`
2. Request Body
```
{
  "name": "product 99",
  "price": 20,
  "category": "tech"
}
```

* Show product `http://localhost:3000/api/v1/products/:productId [GET]`

* Index product `http://localhost:3000/api/v1/products [GET]`

### Orders
* Create Order `http://localhost:3000/api/v1/orders [POST]`
* Required:
1. Request Body
```
{
  "userId": "c5b9a9fc-cc7f-466c-8fac-c48a19f77aa8",
  "productId": "1f6751f5-8f4e-4208-a48d-366ae7f00aef",
  "quantity": 99,
  "status": "completed"
}
```

* Index Orders by user id & status `http://localhost:3000/api/v1/orders/user/:userId [GET]`
* Optional:
1. Request Body
```
{
  "status": "completed" // Or active for filter orders
}
```


