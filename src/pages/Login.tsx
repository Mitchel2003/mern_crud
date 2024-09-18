import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LoginFooter from '@/components/Login/LoginFooter';
import LoginHeader from '@/components/Login/LoginHeader';
import LoginForm from '@/components/Login/LoginForm';
import { Card } from "@/components/ui/card";

const Login = () => {
  const { theme } = useThemeContext();
  const { isAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate('/tasks');
  }, [isAuth, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br transition-colors duration-500
      ${theme === 'dark'
        ? 'from-zinc-900 to-purple-900'
        : 'from-white to-purple-50'
      }`}
    >
      <Card className={`w-full max-w-md transition-all duration-500 backdrop-filter backdrop-blur-lg
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