import { Request, Response } from "express";
import ExtendsRequest from "../interfaces/request.interface";
import Task from "../models/task.models";

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id).populate('user');
    if (!task) return res.status(404).json(['Task not found']);
    res.status(200).json([task]);
  } catch (e) { res.status(404).json([`Error to get task => ${e}`]) }
}

export const getTasks = async (req: ExtendsRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user?.id }).populate('user');
    const length = tasks.length;
    const plural = length === 1 ? '' : 's';
    const message = `---> ${length} tarea${plural} <---`;
    res.status(200).json([`${message} => ${tasks}`]);
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) return res.status(404).json(['Task not has been updated']);
    res.status(204).json(['Successfull update']);
  } catch (e) { res.status(404).json([`Error to update task => ${e}`]) }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json(['Task not found']);
    res.status(200).json(['Successfull deleted']);
  } catch (e) { res.status(404).json([`Error to delete task => ${e}`]) }
}