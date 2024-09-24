import Footer from '#/login/Footer';
import Header from '#/login/Header';
import Form from '#/login/Form';
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
    <div className="w-full max-w-md relative">
      {/* card */} {/* no es necesario z-10 porque el card es un elemento de bloque */}
      <Card className={`relative w-full transition-all duration-300 backdrop-filter backdrop-blur-lg
        ${theme === 'dark'
          ? 'bg-zinc-800/90 hover:shadow-purple-900/60'
          : 'bg-white hover:shadow-purple-500/60'
        }`}
      >
        <Header theme={theme} />
        <Form theme={theme} />
        <Footer theme={theme} />
      </Card>
    </div>
  )
}

export default Login