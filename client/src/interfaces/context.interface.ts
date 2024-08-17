export interface UserCredentials {
  id?: string,
  username?: string,
  email?: string
}

export interface TypeContext {
  isAuth: boolean;
  user?: UserCredentials;
  errors?: string[];
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
}