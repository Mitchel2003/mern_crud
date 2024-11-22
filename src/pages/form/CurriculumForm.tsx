import CurriculumSection from "@/sections/form/curriculum/CurriculumSection"
import { useThemeContext } from "@/context/ThemeContext"

const CurriculumForm = () => {
  const { theme } = useThemeContext()

  return (
    <CurriculumSection theme={theme} />
  )
}

export default CurriculumForm