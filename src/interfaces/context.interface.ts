//AuthContext
export type User = { _id: string, username: string, email: string } | {}

export type AuthContext = {
  user: User;
  isAuth: boolean;
  loading: boolean;
  errors: string[];
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
  logout: () => void;
} | undefined


//TaskContext
export type Task = {
  _id: string;
  title: string;
  description: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskContext = {
  errors: string[];
  getTask: (id: string) => Promise<Task>;
  getTasks: () => Promise<Task[]>;
  createTask: (task: object) => Promise<Task>;
  updateTask: (id: string, task: object) => Promise<Task>;
  deleteTask: (id: string) => Promise<Task>;
} | undefined