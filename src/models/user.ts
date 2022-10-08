import client from '../db/postgresDB'
import User from '../types/user'
import HttpError from '../models/httpError'
import hashingPassword from '../utils/passwordHashing'
import compareHashedPassword from '../utils/compareHashedPassword'

// Create model class for User
export class UserModel {}

// Export the model
export default UserModel
