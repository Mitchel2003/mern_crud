import { Request } from "express";

interface ExtendsRequest extends Request {
  user?: { id?: string; };
}

export default ExtendsRequest