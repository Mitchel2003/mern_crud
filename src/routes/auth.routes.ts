import { Router } from "express";
import authRequired from "../middlewares/auth.middleware";
import validateSchema from "../middlewares/validator.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { login, register, logout, profile, tokenCredentials } from "../controllers/auth.controller";

const router = Router();

router.post('/login', validateSchema(loginSchema), login);
router.post('/register', validateSchema(registerSchema), register);
router.post('/logout', logout);
router.get('/verify', tokenCredentials);
router.get('/profile', authRequired, profile);

export default router;