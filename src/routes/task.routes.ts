import { Router } from "express";
import authRequired from "../middlewares/auth.middleware";
import validateSchema from "../middlewares/validator.middleware";
import { createTaskSchema } from "../schemas/task.schema";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller";

const router = Router();

router.get('/task/:id', authRequired, getTask)
router.get('/tasks', authRequired, getTasks)
router.post('/task', authRequired, validateSchema(createTaskSchema), createTask)
router.put('/task/:id', authRequired, updateTask)
router.delete('/task/:id', authRequired, deleteTask)

export default router;
