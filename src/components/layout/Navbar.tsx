import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { SidebarTrigger } from '#/ui/sidebar'
import ThemeToggle from '#/layout/Theme'

import { useIsMobile } from '@/hooks/ui/use-mobile'
import gsIcon from '/assets/gs_icon.ico'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const isMobile = useIsMobile()
  return (
    <nav
      className={cn(
        'flex py-2 px-6 justify-between items-center',
        'shadow-md backdrop-blur-md transition-colors duration-500',
        theme === 'dark' ? 'bg-zinc-800/90 text-zinc-100' : 'bg-white/90 text-gray-900'
      )}
    >
      <HeaderNavbar isAuth={isAuth} />

      <div className="flex items-center gap-x-2 md:gap-x-4">
        <ThemeToggle />
        {isMobile ? <SidebarTrigger /> : null}
      </div>
    </nav>
  )
}

export default Navbar
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface HeaderNavbarProps { isAuth: boolean }
const HeaderNavbar = ({ isAuth }: HeaderNavbarProps) => {
  return (
    <Link to="/" className="flex items-center gap-x-4">
      <span className="flex w-14 h-14 mr-2 items-center justify-center">
        <img src={gsIcon} alt="GS Icon" />
      </span>
      <h1 className="text-2xl">
        {isAuth ? 'Dashboard' : 'Gestión salud'}
      </h1>
    </Link>
  )
}