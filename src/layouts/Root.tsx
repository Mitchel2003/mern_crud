import { AnimatedBackground } from '#/layout/AnimatedBackground'
import { LoadingScreen } from "#/ui/loading-screen"
import { Sidebar } from '#/layout/sidebar/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'

import { useSidebarContext } from '@/context/SidebarContext'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import ScrollToTop from '@/hooks/ui/useScrollTop'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const RootLayout = () => {
  const { isExpanded } = useSidebarContext()
  const { theme } = useThemeContext()
  const { user, isAuth } = useAuthContext()

  return (
    <>
      <AnimatedBackground theme={theme}>
        <Sidebar auth={isAuth} user={user} />
        <main
          className={cn(
            'flex flex-col min-h-screen',
            'transition-all duration-300',
            isExpanded ? 'ml-[220px]' : 'ml-[70px]'
          )}
        >
          <Outlet />
          <Footer theme={theme} />
        </main>
      </AnimatedBackground>

      {/* Componentes UI globales */}
      <Toaster />
      <ScrollToTop />
      <LoadingScreen />
    </>
  )
}

export default RootLayout