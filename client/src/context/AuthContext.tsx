import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import { TypeContext, UserContext } from '../interfaces/context.interface';
import { Props } from '../interfaces/props.interface';

const AuthContext = createContext<TypeContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserContext>({});
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState([]);

  const signin = async (user: object) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuth(true);
    } catch (e) { setErrors(e.response.data) }
  }
  const signup = async (user: object) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuth(true);
    } catch (e) { setErrors(e.response.data) }
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, errors, signin, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
