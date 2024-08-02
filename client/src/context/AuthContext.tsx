import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import { ContextType, UserContext } from '../interfaces/context.interface';
import { Props } from '../interfaces/props.interface';

const AuthContext = createContext<ContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserContext>({});
  const [isAuth, setIsAuth] = useState(false);

  const signin = async (user: object) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuth(true);
    } catch (e) { console.log(e) }
  }
  const signup = async (user: object) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuth(true);
    } catch (e) { console.log(e) }
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, signin, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
