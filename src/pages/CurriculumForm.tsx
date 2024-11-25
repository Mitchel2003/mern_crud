import CurriculumSection from "@/sections/curriculum/CurriculumSection"
import { useThemeContext } from "@/context/ThemeContext"

const CurriculumForm = () => {
  const { theme } = useThemeContext()

  return (
    <div className="w-full py-10">
      <CurriculumSection theme={theme} />
    </div>
  )
}

export default CurriculumForm