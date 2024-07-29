import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller";

const router = Router();
router.get('/task/:id', auth, getTask)
router.get('/tasks', auth, getTasks)
router.post('/task', auth, createTask)
router.put('/task/:id', auth, updateTask)
router.delete('/task/:id', auth, deleteTask)

export default router;
