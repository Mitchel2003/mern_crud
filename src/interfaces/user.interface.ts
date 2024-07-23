import { Document } from "mongoose";

interface User extends Document {
  username: string,
  email: string,
  password: string
}

export default User;