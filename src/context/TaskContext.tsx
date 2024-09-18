import { createTaskRequest, getTaskRequest, getTasksRequest, updateTaskRequest, deleteTaskRequest } from "@/api/task";
import { isApiResponse, isAxiosResponse } from "@/interfaces/response.interface";
import { TaskContext } from "@/interfaces/context.interface";
import { Props } from "@/interfaces/props.interface";

import { useState, useContext, createContext, useEffect } from "react";

const Task = createContext<TaskContext>(undefined)

export const useTaskContext = () => {
  const context = useContext(Task)
  if (!context) throw new Error('Error to try use taskContext')
  return context
}

export const TaskProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => timeAlert(), [errors])

  const timeAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  //functions
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
    if (isAxiosResponse(e)) setErrors([e.response.data])
    if (isApiResponse(e)) setErrors([e.data])
  }

  return (
    <Task.Provider value={{ errors, getTask, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </Task.Provider>
  )
}