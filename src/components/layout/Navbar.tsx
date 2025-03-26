import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { Notifications } from "#/layout/Notifications"
import UserMenu from '#/pages/dashboard/UserMenu'
import { SidebarTrigger } from '#/ui/sidebar'
import ThemeToggle from '#/layout/Theme'
import { motion } from "framer-motion"

import { Link, useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/ui/use-mobile'
import gsIcon from '/assets/gs_ico.ico'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const pathSegments = useLocation().pathname.split("/").filter(Boolean) || []
  const lastSegment = pathSegments.slice(-1)[0]
  const isRoute = lastSegment?.length < 15
  const { user, isAuth } = useAuthContext()
  const { theme } = useThemeContext()
  const isMobile = useIsMobile()
  return (
    <header className={cn(
      'sticky top-0 z-20 bg-gradient-to-r',
      'backdrop-blur-sm transition-colors duration-500',
      theme === 'dark' ? 'from-zinc-800 to-zinc-800/30 text-zinc-100' : 'from-white to-white/30 text-gray-900'
    )}>
      <div className="container flex h-16 p-4 items-center justify-between">
        {isMobile ? <SidebarTrigger /> : null}
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <motion.div initial={{ rotate: -10, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.5 }}>
              <span className={cn("flex h-16 mr-2 items-center justify-center", isAuth ? 'w-20' : 'w-24')}>
                <img src={gsIcon} alt="GS Icon" />
              </span>
            </motion.div>
          )}
          {isAuth ? (<>
            <Link to="/" className="text-sm font-medium"> GEST.ing </Link>
            {lastSegment && isRoute && <span className="text-muted-foreground">/</span>}
            {lastSegment && isRoute && <span className="text-sm font-medium">{lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)}</span>}
          </>) : <h1 className="text-xl font-bold">GEST.ing</h1>}
        </div>

        <div className="flex items-center gap-x-2 md:gap-x-4">
          <ThemeToggle />
          {isAuth && user && (
            <>
              <Notifications theme={theme} />
              <UserMenu user={user} theme={theme} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar