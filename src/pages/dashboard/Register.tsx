import RegisterSection from "@/sections/dashboard/register/RegisterSection"
import { useThemeContext } from "@/context/ThemeContext"
import { useAuthContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

const Register = () => {
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => { if (isAuth) navigate('/dashboard') }, [isAuth])

  return (
    <div className={cn("flex justify-center items-center")}>
      <RegisterSection theme={theme} id={undefined} />
    </div>
  )
}

export default Register