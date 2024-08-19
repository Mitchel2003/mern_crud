import { useState, useContext, createContext } from 'react';

import { createTaskRequest, getTasksRequest } from "../api/task";
import { TaskContext, Tasks } from '../interfaces/context.interface';
import { Props } from '../interfaces/props.interface';

const Task = createContext<TaskContext>(undefined);

export const useTasks = () => {
  const context = useContext(Task);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const TaskProvider = ({ children }: Props) => {
  const [tasks, setTasks] = useState<Tasks>([]);

  const getTask = async () => { setTasks([]) }

  const getTasks = async () => {
    const res = await getTasksRequest();
    if (!res.data) return console.log(res);
    setTasks(res.data)
  }
  const createTask = async (task: object) => {
    const res = await createTaskRequest(task);
    if (!res.data) return console.log(res);
    // console.log(res);
  }
  const updateTask = async () => {

  }
  const deleteTask = async () => {

  }

  return (
    <Task.Provider value={{ tasks, getTask, getTasks, createTask, updateTask, deleteTask }}>
      {children}
    </Task.Provider>
  )
}

//function isTask(e: unknown): e is Tasks { return (!Array.isArray(e)) }