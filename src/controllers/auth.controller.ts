import { Request, Response } from "express";
import { Document } from "mongoose";

import ExtendsRequest from "../interfaces/request.interface";
import { Result, Error } from "../interfaces/props.interface";
import { encrypt, verified } from "../libs/bcrypt.handle";
import { generateAccessToken } from "../libs/jwt.handle";
import User from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  try {
    const user = await verifyCredentials(req);
    if ('error' in user) return res.status(403).json([user.error]);
    const { _id } = user.value;//user correct
    const token = await generateAccessToken({ id: _id });
    res.cookie("token", token);
    res.json({ id: _id });
  } catch (e) { res.status(500).json([`Error to try login => ${e}`]) }
}

export const register = async (req: Request, res: Response) => {
  try {
    await isAccountFound(req, res);
    const user = await createUserEncrypt(req);
    const token = await generateAccessToken({ id: user._id });
    res.cookie("token", token);
    res.status(200).json(['User registed']);
  } catch (e) { res.status(500).json([`Error to try register => ${e}`]) }
}

export const logout = (res: Response) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
}

export const profile = async (req: ExtendsRequest, res: Response) => {
  const document = await User.findById(req.user?.id);
  if (!document) return res.status(401).json(["User not found"]);
  res.status(200).json({
    id: document._id,
    username: document.username
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
async function verifyCredentials(req: Request): Promise<Result<Document, Error>> {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });
  const isMatch = await verified(password, userFound?.password);
  if (!isMatch || !userFound) return { error: 'Invalid credentials' }
  return { value: userFound }
}
async function isAccountFound(req: Request, res: Response) {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if (userFound) return res.status(403).json(['Email is used']);
}
async function createUserEncrypt(req: Request) {
  const { username, email, password } = req.body;
  const passHash = await encrypt(password, 10);
  const user = new User({ username, email, password: passHash });
  return await user.save();
}
/*---------------------------------------------------------------------------------------------------------*/