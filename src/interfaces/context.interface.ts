/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
} | undefined

export interface ThemeContextProps { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------AuthContext--------------------------------------------------*/
export type User = { _id: string, username: string, email: string } | undefined

export type AuthContext = {
  user: User;
  isAuth: boolean;
  loading: boolean;
  errors: string[];
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
  logout: () => void;
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------TaskContext--------------------------------------------------*/
export type Task = {
  _id: string;
  title: string;
  description: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
} | undefined

export type TypeTask = {
  (id: string): Promise<Task>
}
export type TypeTasks = {
  (): Promise<Task[]>
}
export type CreateTask = {
  (task: object): Promise<Task>
}
export type UpdateTask = {
  (id: string, task: object): Promise<Task>
}
export type DeleteTask = {
  (id: string): Promise<Task>
}

export type TaskContext = {
  errors: string[];
  getTask: TypeTask;
  getTasks: TypeTasks;
  createTask: CreateTask;
  updateTask: UpdateTask;
  deleteTask: DeleteTask;
} | undefined
/*---------------------------------------------------------------------------------------------------------*/