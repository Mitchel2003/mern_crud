import { Request } from "express";

interface ExtendsRequest extends Request { user?: UserRequest }
interface UserRequest { id?: string }

export default ExtendsRequest