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




