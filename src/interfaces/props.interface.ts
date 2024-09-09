import { Task } from "./context.interface";
import { ReactNode } from "react";

//interface defautl props
export interface Props { children?: ReactNode }

export type TaskCardProps = { task: Task }

//interface to implement mutation "QueryReact"
// export interface CustomMutation extends CreateTask, UpdateTask { }