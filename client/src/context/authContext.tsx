import { createContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const signup = async (user) => {
    const req = await registerRequest(user);
    console.log(req);
  }
  const signin = async (user) => {
    const req = await loginRequest(user);
    console.log(req);
  }

  return (
    <AuthContext.Provider value={{user, signup, signin}}>
      { children }
    </AuthContext.Provider>
  )
}
