export interface UserContext {
  id?: string,
  username?: string,
  email?: string
}

export interface ContextType {
  isAuth: boolean;
  user?: UserContext;
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
}