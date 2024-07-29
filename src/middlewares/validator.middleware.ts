import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validateSchema = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    return res
      .status(400)
      .json({ error: '' }) //working here...
  }
}

export default validateSchema;