import { useState, useContext, createContext } from 'react';

import { createTaskRequest, getTaskRequest, getTasksRequest, updateTaskRequest, deleteTaskRequest } from "../api/task";
import { isApiResponse, isAxiosResponse } from '../interfaces/response.interface';
import { TaskContext } from '../interfaces/context.interface';
import { Props } from '../interfaces/props.interface';

const Task = createContext<TaskContext>(undefined);

export const useTasks = () => {
  const context = useContext(Task);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const TaskProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);

  const getTask = async (id: string) => {
    try { const res = await getTaskRequest(id); return res.data }
    catch (e: unknown) { setTaskStatus(e) }
  }

  const getTasks = async () => {
    try { const res = await getTasksRequest(); return res.data }
    catch (e: unknown) { setTaskStatus(e) }
  }

  const createTask = async (task: object) => {
    try { const res = await createTaskRequest(task); return res.data }
    catch (e: unknown) { setTaskStatus(e) }
  }

  const updateTask = async (id: string, task: object) => {
    try { const res = await updateTaskRequest(id, task); return res.data }
    catch (e: unknown) { setTaskStatus(e) }
  }

  const deleteTask = async (id: string) => {
    try { const res = await deleteTaskRequest(id); return res.data }
    catch (e: unknown) { setTaskStatus(e) }
  }

  const setTaskStatus = (e: unknown) => {
    if (isAxiosResponse(e)) setErrors(e.response.data)
    if (isApiResponse(e)) setErrors(e.data)
  }

  return (
    <Task.Provider value={{ errors, getTask, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </Task.Provider>
  )
}