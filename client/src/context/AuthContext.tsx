import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';

import { loginRequest, registerRequest, tokenCredentialsRequest } from '../api/auth';
import { TypeContext, UserCredentials } from '../interfaces/context.interface';
import { ErrorResponse } from '../interfaces/response.interface';
import { Props } from '../interfaces/props.interface';

const AuthContext = createContext<TypeContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserCredentials>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => showAlert(), [errors]);
  useEffect(() => { verifyToken() }, []);

  const showAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  const verifyToken = async () => {
    if (!Cookies.get().token) { setIsAuth(false); setUser({}); return }

    try {
      const res = await tokenCredentialsRequest();
      if (!res.data) return setIsAuth(false);
      setIsAuth(true);
      setUser(res.data);
      setIsLoading(false);
    } catch (e: unknown) {
      setUser({});
      setIsAuth(false);
      setIsLoading(false);
      if (axios.isAxiosError(e)) setErrors([e.response?.data]);
    }
  }

  const signin = async (user: object) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuth(true);
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
    <AuthContext.Provider value={{ isAuth, isLoading, user, errors, signin, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}