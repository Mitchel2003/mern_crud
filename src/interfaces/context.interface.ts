/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
} | undefined

export type ThemeContextProps = { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------AuthContext--------------------------------------------------*/
export type User = {
  _id: string,
  role: string,
  email: string,
  username: string,
  permissions: object
} | undefined

export type AuthContext = {
  user: User;
  isAuth: boolean;
  loading: boolean;
  errors: string[];
  signin: (data: object) => Promise<void>;
  signup: (data: object) => Promise<void>;
  logout: () => void;
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------CurriculumContext--------------------------------------------------*/
export type Curriculum = { _id: string } | undefined

export type CurriculumContext = {
  errors: string[];
  getCV: (id: string) => Promise<Curriculum>;
  getCVs: () => Promise<Curriculum[]>;
  createCV: (Curriculum: object) => Promise<Curriculum>;
  updateCV: (id: string, Curriculum: object) => Promise<Curriculum>;
  deleteCV: (id: string) => Promise<Curriculum>;
} | undefined
/*---------------------------------------------------------------------------------------------------------*/