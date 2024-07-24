import { Request, Response } from "express";

import { encrypt, verified } from "../utils/password.handle";
import { createAccessToken } from "../libs/jwt";
import User from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  try {
    const access = await validateCredencials(req);
    if (!access) return res.status(400).json({ message: "Invalid credentials" });
    const token = await createAccessToken({ id: access._id });
    res.cookie("token", token);
    res.json({ id: access._id, username: access.username, email: access.email });
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

async function validateCredencials({ body }: Request) {
  const { email, password } = body;
  const userFound = await User.findOne({ email })
  const isMatch = await verified(password, userFound?.password);
  if (!isMatch || !userFound) return;
  return userFound;
}