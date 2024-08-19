import { Task } from "../interfaces/context.interface";
import axios from "./axios";

export const getTaskRequest = async (id: string) => axios.get(`/task/${id}`);
export const getTasksRequest = async () => axios.get('/tasks');
export const createTaskRequest = async (task: object) => axios.post('/task', task);
export const updateTaskRequest = async (task: Task) => axios.put(`/task/${task._id}`, task);
export const deleteTaskRequest = async (id: string) => axios.delete(`/task/${id}`);