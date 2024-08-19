import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';

import { loginRequest, registerRequest, tokenCredentialsRequest } from '../api/auth';
import { User, AuthContext } from '../interfaces/context.interface';
import { ErrorResponse } from '../interfaces/response.interface';
import { Props } from '../interfaces/props.interface';

const Auth = createContext<AuthContext>(undefined);

export const useAuth = () => {
  const context = useContext(Auth);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => showAlert(), [errors]);
  useEffect(() => { verifyToken() }, []);

  const showAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  const verifyToken = async () => {
    if (!Cookies.get().token) { setIsAuth(false); return setLoading(false) }

    try {
      const res = await tokenCredentialsRequest();
      if (!res.data) return setIsAuth(false);
      setIsAuth(true);
      setUser(res.data);
      setLoading(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) setErrors([e.response?.data]);
      setLoading(false);
      setIsAuth(false);
      setUser({});
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
    <Auth.Provider value={{ isAuth, loading, user, errors, signin, signup }}>
      {children}
    </Auth.Provider>
  )
}

function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}