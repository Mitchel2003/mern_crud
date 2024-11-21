import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import LoginSection from '@/sections/login/LoginSection'

const Login = () => {
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => { if (isAuth) navigate('/dashboard') }, [isAuth])

  return (
    <div className="w-full max-w-md relative">
      <LoginSection theme={theme} />
    </div>
  )
}

export default Login