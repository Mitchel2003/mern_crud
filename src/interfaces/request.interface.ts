import { Request } from "express";
import { Schema } from "mongoose";

interface ExtendsRequest extends Request { user?: UserSchema }
interface UserSchema { id?: Schema.Types.ObjectId }

export default ExtendsRequest
