import { useThemeContext } from "@/context/ThemeContext"
import Curriculum from "@/sections/curriculum"

const Register = () => {
  const { theme } = useThemeContext()
  return (
    <Curriculum theme={theme} />
  )
}

export default Register