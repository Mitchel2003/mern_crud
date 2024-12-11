import { AnimatedBackground } from '#/layout/AnimatedBackground'
import { LoadingScreen } from "#/ui/loading-screen"
import { Sidebar } from '#/layout/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'

import { useSidebarContext } from '@/context/SidebarContext'
import { useThemeContext } from '@/context/ThemeContext'
import ScrollToTop from '@/hooks/ui/useScrollTop'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const RootLayout = () => {
  const { theme } = useThemeContext()
  const { open } = useSidebarContext()

  return (
    <>
      <AnimatedBackground theme={theme}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main
            className={cn(
              'flex-1 transition-all duration-300',
              'flex flex-col min-h-screen',
              open ? 'ml-[220px]' : 'ml-[70px]'
            )}
          >
            <div className="flex-1 p-6">
              <Outlet />
            </div>
            <Footer theme={theme} />
          </main>
        </div>
      </AnimatedBackground>

      {/* Componentes UI globales */}
      <Toaster />
      <ScrollToTop />
      <LoadingScreen />
    </>
  )
}

export default RootLayout