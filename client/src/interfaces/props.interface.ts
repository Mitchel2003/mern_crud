import { ReactNode } from "react";
import { Task } from "./context.interface";

//interface defautl props
export interface Props { children?: ReactNode }

export type TaskCardProps = { task: Task }