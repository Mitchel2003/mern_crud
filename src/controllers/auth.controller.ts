import { Request, Response } from "express";

import ExtendsRequest from "../interfaces/request.interface";
import { encrypt, verified } from "../libs/bcrypt.handle";
import { createAccessToken } from "../libs/jwt.handle";
import User from "../models/user.model";
/*--------------------------------------------------controllers--------------------------------------------------*/
export const login = async (req: Request, res: Response) => {
  try {
    const access = await validateCredencials(req);
    if (!access) return res.status(400).json({ message: "Invalid credentials" });
    const token = await createAccessToken({ id: access._id });
    res.cookie("token", token);
    res.json({ id: access._id });
  } catch (e) { res.status(500).json({ message: `Error to login => ${e}` }) }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const passHash = await encrypt(password, 10);
    const new_user = new User({ username, email, password: passHash });
    const userCredentials = await new_user.save();
    const token = await createAccessToken({ id: userCredentials._id });
    res.cookie("token", token);
    res.send("User registed");
  } catch (e) { res.status(500).json({ message: `Error to register => ${e}` }) }
}

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
}

export const profile = async (req: ExtendsRequest, res: Response) => {
  const document = await User.findById(req.user?.id);
  if (!document) return res.status(401).json({ message: "User not found" });
  res.json({
    id: document._id,
    username: document.username
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
async function validateCredencials({ body }: Request) {
  const { email, password } = body;
  const userFound = await User.findOne({ email })
  const isMatch = await verified(password, userFound?.password);
  if (!isMatch || !userFound) return;
  return userFound;
}
/*---------------------------------------------------------------------------------------------------------*/
