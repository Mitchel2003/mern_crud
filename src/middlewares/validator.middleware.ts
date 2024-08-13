import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

const validateSchema = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    if (!(e instanceof ZodError)) return res.sendStatus(500);
    return res.status(400).json(e.errors.map(alert => alert.message));
  }
}

export default validateSchema;
