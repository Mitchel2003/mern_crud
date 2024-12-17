import { AnimatedBackground } from '#/layout/AnimatedBackground'
import { LoadingScreen } from "#/ui/loading-screen"
import { AppSidebar } from '#/layout/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'

import { useThemeContext } from '@/context/ThemeContext'
import ScrollToTop from '@/hooks/ui/useScrollTop'
import { SidebarProvider, SidebarTrigger } from '#/ui/sidebar'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const RootLayout = () => {
  const { theme } = useThemeContext()

  return (
    <>
      <AnimatedBackground theme={theme}>
        <SidebarProvider>
          <AppSidebar />
          <main
            className={cn(
              'flex flex-col z-10',
              'items-center justify-center',
              'transition-all duration-300'
            )}
          >
            <SidebarTrigger />
            <Outlet />
            <Footer theme={theme} />
          </main>
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