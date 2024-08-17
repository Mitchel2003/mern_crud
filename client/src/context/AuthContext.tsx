import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";

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
  const [errors, setErrors] = useState<string[]>([]);
  const [user, setUser] = useState<UserCredentials>({});
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => { showAlert() }, [errors]);
  useEffect(() => { verifyToken() }, []);

  const showAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  const verifyToken = async () => {
    const { token } = Cookies.get();
    if (!token) return setIsAuth(false);

    try {
      const res = await tokenCredentialsRequest();
      console.log(res);

      if (!res.data) return setIsAuth(false);
      setUser(res.data);
      setIsAuth(true);
    } catch (e: unknown) {

      console.log(e);
      // setErrors([e.toString()])
      setIsAuth(false);
      setUser({});
    }
  }

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