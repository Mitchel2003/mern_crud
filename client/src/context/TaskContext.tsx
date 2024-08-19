import { useState, useContext, createContext } from 'react';

import { createTaskRequest, getTaskRequest, getTasksRequest, updateTaskRequest, deleteTaskRequest } from "../api/task";
import { TaskContext, Task as TypeTask } from '../interfaces/context.interface';
import { ErrorResponse } from '../interfaces/response.interface';
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
    try {
      const res = await getTaskRequest(id);
      setTasks([res.data]);
    } catch (e) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data)
    } catch (e) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const createTask = async (task: object) => {
    try {
      const res = await createTaskRequest(task);
      if (res.data) setTasks(res.data);
    } catch (e) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const updateTask = async (data: TypeTask) => {
    try {
      const res = await updateTaskRequest(data);
      if (res.data) setTasks(res.data);
    } catch (e) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.data) setTasks(res.data);
    } catch (e) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  return (
    <Task.Provider value={{ tasks, errors, getTask, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </Task.Provider>
  )
}

function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}