import { Task } from "./context.interface";
import { ReactNode } from "react";

//interface defautl props
export interface Props { children?: ReactNode }

export type TaskCardProps = { task: Task }

//interface to use mutation using QueryReact
export interface CustomMutation {
  (task: object): Promise<Task>;
  (id: string, task: object): Promise<Task>;
}
