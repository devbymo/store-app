type User = {
  id?: string
  email: string
  first_name: string
  last_name: string
  password: string
  data?: {
    token: string
  }
}

export default User
