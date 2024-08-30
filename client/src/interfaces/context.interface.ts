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
export type Task = { _id: string, title: string, description: string, date: Date }

export type TaskContext = {
  tasks: Task[];
  errors: string[];
  getTask: (id: string) => Promise<void>;
  getTasks: () => Promise<void>;
  createTask: (task: object) => Promise<void>;
  updateTask: (data: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
} | undefined