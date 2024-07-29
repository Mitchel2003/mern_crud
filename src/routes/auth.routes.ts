import { Router } from "express";
import authRequired from "../middlewares/auth.middleware";
import { login, register, logout, profile } from "../controllers/auth.controller";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);

export default router;