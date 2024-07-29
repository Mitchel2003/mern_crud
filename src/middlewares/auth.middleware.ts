import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt.handle"
import ExtendsRequest from "../interfaces/request.interface";

export default async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Token not found, auth denied" });
  const user = await verifyAccessToken(token);
  if (!user.id) return res.status(401).json({ message: "Invalid token" });
  req.user = user;
  next();
}
