import { Request, Response } from "express";
import Task from "../models/task.models";

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) return res.status(404);
    res.json({ message: "Success", task });
  } catch (e) { res.status(404).json({ message: `Error to get task: ${e}` }) }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    const length = tasks.length;
    const plural = length === 1 ? '' : 's';
    const message = `---> ${length} tarea${plural} <---`;
    res.json({ message, tasks });
  } catch (e) { res.status(404).json({ message: `Error to get tasks: ${e}` }) }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, date } = req.body;
    const taskForm = new Task({ title, description, date });
    const task = await taskForm.save();
    res.json({ message: "save success", task });
  } catch (e) { res.status(404).json({ message: `Error to create task: ${e}` }) }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) return res.status(404);
    res.json({ message: "update success", task });
  } catch (e) { res.status(404).json({ message: `Error to update task: ${e}` }) }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404);
    res.json({ message: "delete done", task });
  } catch (e) { res.status(404).json({ message: `Error to delete task: ${e}` }) }
}