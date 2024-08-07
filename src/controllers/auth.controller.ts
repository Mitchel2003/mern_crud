import { Request, Response } from "express";
import { Document } from "mongoose";

import ExtendsRequest from "../interfaces/request.interface";
import { encrypt, verified } from "../libs/bcrypt.handle";
import { generateAccessToken } from "../libs/jwt.handle";
import User from "../models/user.model";
/*--------------------------------------------------controllers--------------------------------------------------*/
export const login = async (req: Request, res: Response) => {
  try { 
    const user = await verifyCredencials(req, res);
    const token = await generateAccessToken({ id: user._id });
    res.cookie("token", token);
    res.json({ id: user._id });
  } catch (e) { res.status(500).json(["Error to login => " + e ]) }
}

export const register = async (req: Request, res: Response) => {
  try {
    await isAccountFound(req, res);
    const user = await createUserEncrypt(req);
    const token = await generateAccessToken({ id: user._id });
    res.cookie("token", token);
    res.send("User registed");
  } catch (e) { res.status(500).json(["Error to register => " + e ]) }
}

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
}

export const profile = async (req: ExtendsRequest, res: Response) => {
  const document = await User.findById(req.user?.id);
  if (!document) return res.status(401).json(["User not found"]);
  res.json({
    id: document._id,
    username: document.username
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
async function verifyCredentials({ body }: Request, res: Response): Promise<Document> {
  const { email, password } = body;
  const userFound = await User.findOne({ email });
  const isMatch = await verified(password, userFound?.password);
  if (!isMatch || !userFound) res.status(403);
  return userFound as Document;
}
async function isAccountFound(req: Request, res: Response): Promise<Response> {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if(userFound) return res.status(403);
}
async function createUserEncrypt(req: Request): Promise<Document> {
  const { username, email, password } = req.body;
  const passHash = await encrypt(password, 10);
  const user = new User({ username, email, password: passHash });
  return await user.save();
}
/*---------------------------------------------------------------------------------------------------------*/
