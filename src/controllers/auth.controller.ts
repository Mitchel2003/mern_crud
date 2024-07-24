import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { encrypt } from "../utils/password.handle";
import { createAccessToken } from "../libs/jwt";
import { TOKEN_SECRET } from "../config";
import User from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  try {
    res.send('Login exitoso');
  } catch (e) { console.log('Error to login: ' + e) }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const passHash = await encrypt(password, 10);
    const new_user = new User({ username, email, password: passHash });
    await new_user.save();
    res.send('Registro exitoso');
  } catch (e) { console.log('Error to register: ' + e) }
}
