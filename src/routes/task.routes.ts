import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller";

const router = Router();

router.get('/task/:id', authRequired, getTask)
router.get('/tasks', authRequired, getTasks)
router.post('/task', authRequired, createTask)
router.put('/task/:id', authRequired, updateTask)
router.delete('/task/:id', authRequired, deleteTask)

export default router;
