import { createContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const signin = async (user) => await loginRequest(user);
  const signup = async (user) => await registerRequest(user);

  return (
    <AuthContext.Provider value={{user, signin, signup}}>
      { children }
    </AuthContext.Provider>
  )
}
