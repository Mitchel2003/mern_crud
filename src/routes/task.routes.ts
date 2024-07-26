import { Router } from "express";
import { authRequired } from "../middlewares/validateToken";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller";

const router = Router();

router.get('/tasks/:id', authRequired, getTask)
router.get('/tasks', authRequired, getTasks)
router.post('/tasks', authRequired, createTask)
router.put('/tasks/:id', authRequired, updateTask)
router.delete('/tasks/:id', authRequired, deleteTask)

export default router;