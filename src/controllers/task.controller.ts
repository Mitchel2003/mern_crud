import { Request, Response } from "express";
import Task from "../models/task.models";

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.json({ message: "!Tarea obtenida!", task: task });
  } catch (e) { res.status(404).json({ message: `Task not found: ${e}` }) }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json({ message: `!Un total de ${tasks.length} obtenidas!`, tasks: tasks });
  } catch (e) { res.status(404).json({ message: `Nothing task found: ${e}` }) }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, date } = req.body;
    const taskForm = new Task({ title, description, date });
    const taskSaved = await taskForm.save();
    res.json({
      message: "Tarea guardada satisfactoriamente",
      task: taskSaved
    });
  } catch (e) { res.status(404).json({ message: `Could not be saved: ${e}` }) }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json({
      message: "Tarea actualizada satisfactoriamente",
      task: task
    });
  } catch (e) { res.status(404).json({ message: `Could not be updated: ${e}` }) }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    res.json({
      message: "Tarea eliminada satisfactoriamente",
      task: task
    });
  } catch (e) { res.status(404).json({ message: `Could not be deleted: ${e}` }) }
}