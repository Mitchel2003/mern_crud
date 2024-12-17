import { AnimatedBackground } from '#/layout/AnimatedBackground'
import { LoadingScreen } from "#/ui/loading-screen"
import { SidebarProvider } from '#/ui/sidebar'
import { Sidebar } from '#/layout/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'
import Navbar from '#/layout/Navbar'

import { useThemeContext } from '@/context/ThemeContext'
import ScrollToTop from '@/hooks/ui/useScrollTop'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const RootLayout = () => {
  const { theme } = useThemeContext()

  return (
    <>
      <AnimatedBackground theme={theme}>
        <SidebarProvider>
          <Sidebar />
          <div className={cn('flex flex-col z-10', 'transition-all duration-300')}>
            <Navbar theme={theme} />
            <Outlet />
            <Footer theme={theme} />
          </div>
        </SidebarProvider>
      </AnimatedBackground>

      {/* Componentes UI globales */}
      <Toaster />
      <ScrollToTop />
      <LoadingScreen />
    </>
  )
}

export default RootLayout