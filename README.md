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
psql -U YOUR-USERNAME
Password: ....
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
  "password": "123456"
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

## Data Shapes
#### Products (JSON)
- id (uuid)
- name (string)
- price (number)
- category (string)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(255) NOT NULL
);
```
```json
{
  "id": "e0190697-0080-48c0-8fe8-8d22e16f1442",
  "name": "Product Name",
  "price": 9.99,
  "category": "Category Name",
}
```

#### Users (JSON)
- id (uuid)
- email (string)
- first_Name (string)
- last_Name (string)
- password (string)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```
```json
{
  "id": "e0190697-0080-48c0-8fe8-8d22e16f1442",
  "first_name": "First Name",
  "last_name": "Last Name",
  "email": "mo@gmail.com",
  "password": "password",
}
```

#### Orders
- id (uuid)
- user_id (uuid) (foreign key)
- status (string)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```
```json
{
  "id": "e0190697-0080-48c0-8fe8-8d22e16f1442",
  "user_id": "e0190697-0080-48c0-8fe8-8d22e16f1442",
  "product_id": "e0190697-0080-48c0-8fe8-8d22e16f1442",
  "quantity": 1,
  "status": "active",
}
```


#### Order_products
- id (uuid)
- order_id (uuid) (foreign key)
- product_id (uuid) (foreign key)
- quantity (number)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS order_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```






