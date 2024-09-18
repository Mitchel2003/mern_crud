import { loginRequest, registerRequest, tokenCredentialsRequest } from "@/api/auth";
import { isApiResponse, isAxiosResponse } from "@/interfaces/response.interface";
import { User, AuthContext } from "@/interfaces/context.interface";
import { Props } from "@/interfaces/props.interface";

import { createContext, useContext, useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const Auth = createContext<AuthContext>(undefined)

export const useAuthContext = () => {
  const context = useContext(Auth)
  if (!context) throw new Error('Error to try use authContext')
  return context
}

export const AuthProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User>({});

  useEffect(() => timeAlert(), [errors])
  useEffect(() => { verifyToken() }, [])

  const timeAlert = () => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }

  const verifyToken = async () => {
    if (!Cookies.get().token) return setAuthStatus()
    try {
      const res = await tokenCredentialsRequest();
      setAuthStatus(res);
    } catch (e: unknown) {
      if (isAxiosResponse(e)) setErrors([e.response?.data])
      if (isApiResponse(e)) setErrors([e.data])
      setAuthStatus()
    }
  }

  const signin = async (user: object) => {
    try { const res = await loginRequest(user); setAuthStatus(res) }
    catch (e: unknown) { if (isAxiosResponse(e)) setErrors([e.response.data]) }
  }

  const signup = async (user: object) => {
    try { const res = await registerRequest(user); setAuthStatus(res) }
    catch (e: unknown) { if (isAxiosResponse(e)) setErrors([e.response.data]) }
  }

  const logout = () => { Cookies.remove('token'); setAuthStatus() }

  const setAuthStatus = (res?: AxiosResponse) => {
    setIsAuth(Boolean(res?.data))
    setUser(res?.data ?? {})
    setLoading(false)
  }

  return (
    <Auth.Provider value={{ isAuth, loading, user, errors, signin, signup, logout }}>
      {children}
    </Auth.Provider>
  )
}