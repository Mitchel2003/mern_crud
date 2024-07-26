import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt"
import ExtendsRequest from "../interfaces/request.interface";

export const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Not found token, auth denied" });
  const user = await verifyAccessToken(token);
  if (!user.id) return res.status(401).json({ message: "Invalid token" });
  req.user = user;
  next();
}