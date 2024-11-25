import CountrySection from '@/sections/country/CountrySection'
import { useThemeContext } from '@/context/ThemeContext'

const Country = () => {
  const { theme } = useThemeContext()

  return <CountrySection theme={theme} />
}

export default Country