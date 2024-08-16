import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";

import { TypeContext, UserContext } from '../interfaces/context.interface';
import { ErrorResponse } from '../interfaces/response.interface';
import { Props } from '../interfaces/props.interface';
import { loginRequest, registerRequest } from '../api/auth';

const AuthContext = createContext<TypeContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [user, setUser] = useState<UserContext>({});
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {//working here...
    const cookies = Cookies.get();
    if (cookies.token) console.log(cookies.token);
  }, []);

  const signin = async (user: object) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuth(true);
      console.log(res.data);
    } catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  const signup = async (user: object) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuth(true);
    } catch (e: unknown) { if (isErrorResponse(e)) setErrors(e.response.data) }
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, errors, signin, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}