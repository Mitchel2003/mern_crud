import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt.handle"
import ExtendsRequest from "../interfaces/request.interface";

const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const access = await verifyAccessToken(req.cookies.token);
  if ('error' in access) return res.status(401).json([access.error]);
  req.user = access;
  next();
}

export default authRequired;