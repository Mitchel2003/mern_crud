import LoginFooter from '#/Login/LoginFooter';
import LoginHeader from '#/Login/LoginHeader';
import LoginForm from '#/Login/LoginForm';
import { Card } from '#/ui/card';

import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { theme } = useThemeContext();
  const { isAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate('/tasks');
  }, [isAuth, navigate]);

  return (
    <div className={`min-h-screen w-screen flex items-center justify-center overflow-hidden relative
      ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br bg-[length:400%_200%] animate-gradient-shift
        ${theme === 'dark'
          ? 'from-purple-950/60 via-zinc-800/60 to-purple-950/60'
          : 'from-purple-200 to-violet-200'
        }`}
      />
      <Card className={`w-[90vw] my-[10vh] max-w-md mx-auto transition-all duration-500 backdrop-filter backdrop-blur-lg z-10
        ${theme === 'dark'
          ? 'bg-zinc-800/70 hover:shadow-purple-900/30'
          : 'bg-white/70 hover:shadow-purple-200'
        }`}
      >
        <LoginHeader theme={theme} />
        <LoginForm theme={theme} />
        <LoginFooter theme={theme} />
      </Card>
    </div>
  )
}

export default Login