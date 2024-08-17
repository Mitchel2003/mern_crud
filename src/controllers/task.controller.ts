import { Request, Response } from "express";

import ExtendsRequest from "../interfaces/request.interface";
import TypeTask from "../interfaces/task.interface";
import Task from "../models/task.models";

export const getTask = async ({ params }: Request, res: Response) => {
  try {
    const task = await Task.findById(params.id).populate('user');
    if (!task) return res.status(404).json(['Task not exist']);
    res.status(200).json([messageFormat(task)]);
  } catch (e) { res.status(404).json([`Error to get task => ${e}`]) }
}

export const getTasks = async (req: ExtendsRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user?.id }).populate('user');
    res.status(200).json([messageFormat(tasks)]);
  } catch (e) { res.status(404).json([`Error to get tasks => ${e}`]) }
}

export const createTask = async (req: ExtendsRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const taskForm = new Task({ title, description, user: req.user?.id });
    const task = await taskForm.save();
    res.status(200).json([task]);
  } catch (e) { res.status(404).json([`Error to create task => ${e}`]) }
}

export const updateTask = async ({ params, body }: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(params.id, body, { new: true });
    if (!task) return res.status(404).json(['Task not has been updated']);
    res.status(204).json(['Successfull update']);
  } catch (e) { res.status(404).json([`Error to update task => ${e}`]) }
}

export const deleteTask = async ({ params }: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(params.id);
    if (!task) return res.status(404).json(['Task not found']);
    res.status(200).json(['Successfull deleted']);
  } catch (e) { res.status(404).json([`Error to delete task => ${e}`]) }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
function messageFormat(res: Array<TypeTask> | TypeTask) {
  if (!Array.isArray(res)) return `Title: ${res.title} ||| Description: ${res.description}`;
  const plural = res.length === 1 ? '' : 's';
  return `---> ${res.length} tarea${plural} <--- ${res.map((e) => `|ID: ${e.id}|`).join('/n')}`;
}