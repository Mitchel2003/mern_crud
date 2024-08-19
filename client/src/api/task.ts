import axios from "./axios";
import { Task } from "../interfaces/context.interface";

export const getTaskRequest = async (task: Task) => axios.get(`/task/${task.id}`);
export const getTasksRequest = async () => axios.get('/tasks');
export const createTaskRequest = async (task: object) => axios.post('/task', task);
export const updateTaskRequest = async (task: Task) => axios.put(`/task/${task.id}`, task);
export const deleteTaskRequest = async (task: Task) => axios.delete(`/task/${task.id}`);