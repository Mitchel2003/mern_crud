import { useState, useContext, createContext } from 'react';

import { createTaskRequest, getTaskRequest, getTasksRequest, updateTaskRequest, deleteTaskRequest } from "../api/task";
import { TaskContext, Task as TypeTask } from '../interfaces/context.interface';
import { isErrorResponse } from '../interfaces/response.interface';
import { Props } from '../interfaces/props.interface';

const Task = createContext<TaskContext>(undefined);

export const useTasks = () => {
  const context = useContext(Task);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const TaskProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [tasks, setTasks] = useState<TypeTask[]>([]);

  const getTask = async (id: string) => {
    try { const res = await getTaskRequest(id); return res.data }
    catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const getTasks = async () => {
    try { const res = await getTasksRequest(); setTasks(res.data) }
    catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const createTask = async (task: object) => {
    try { await createTaskRequest(task) }
    catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const updateTask = async (id: string, data: object) => {
    try { await updateTaskRequest(id, data) }
    catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.data) setTasks(prev => prev.filter(e => e._id !== id))
    } catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  return (
    <Task.Provider value={{ tasks, errors, getTask, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </Task.Provider>
  )
}