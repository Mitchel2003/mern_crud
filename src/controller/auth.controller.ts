import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  console.log(req);
  
  res.send('processing login...')
}

export const register = (req: Request, res: Response) => {
  console.log(req.body);
  res.send('processing register...')
}