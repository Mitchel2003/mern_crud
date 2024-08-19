//AuthContext
export type User = { _id: string, username: string, email: string } | {};

export type AuthContext = {
  user: User;
  isAuth: boolean;
  loading: boolean;
  errors: string[];
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
} | undefined


//TaskContext
export interface Task { _id: string, title: string, description: string, date: Date }
export type Tasks = Task[] | [];

export type TaskContext = {
  tasks: Tasks,
  getTask: () => Promise<void>,
  getTasks: () => Promise<void>,
  createTask: (task: object) => Promise<void>,
  updateTask: () => Promise<void>,
  deleteTask: () => Promise<void>
} | undefined