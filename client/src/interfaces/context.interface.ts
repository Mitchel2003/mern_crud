export interface UserContext {
  id?: string,
  username?: string,
  email?: string
}

export interface TypeContext {
  isAuth: boolean;
  user?: UserContext;
  errors?: string[];
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
}