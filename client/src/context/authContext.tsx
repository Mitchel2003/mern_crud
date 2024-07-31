import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error('Error to try use context');
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signin = async (user) => {
    const res = await loginRequest(user);
    setUser(res.data);
  }
  const signup = async (user) => {
    const res = await registerRequest(user);
    setUser(res.data);
  }

  return (
    <AuthContext.Provider value={{ user, signin, signup }}>
      { children }
    </AuthContext.Provider>
  )
}
