import { useThemeContext } from "@/context/ThemeContext"
import { useAuthContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

import LoginSection from "@/sections/login"
import FloatingShape from "@/components/others/FloatingShape"

const Login = () => {
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/tasks')
  }, [isAuth, navigate])

  return (
    <>
      <div className="w-full max-w-md relative">
        <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
        <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="-20%" left="80%" delay={5} />
        <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

        <LoginSection theme={theme} />
      </div>
    </>
  )
}

export default Login