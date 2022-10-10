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



