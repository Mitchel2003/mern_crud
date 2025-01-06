import { DialogConfirmProvider as ConfirmProvider } from '@/context/DialogConfirmContext'
import { AnimatedBackground } from '#/layout/AnimatedBackground'
import { SidebarInset, SidebarProvider } from '#/ui/sidebar'
import { LoadingScreen } from "#/ui/loading-screen"
import { Sidebar } from '#/layout/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'
import Navbar from '#/layout/Navbar'

import ScrollToTop from '@/hooks/ui/useScrollTop'
import { Outlet } from 'react-router-dom'

const RootLayout = () => (
  <>
    <ConfirmProvider>
      <AnimatedBackground>
        <SidebarProvider>
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <SidebarInset>
            <Navbar />
            <Outlet />
            <Footer />
          </SidebarInset>

        </SidebarProvider>
      </AnimatedBackground>
    </ConfirmProvider>

    {/* Componentes UI globales */}
    <Toaster />
    <ScrollToTop />
    <LoadingScreen />
  </>
)

export default RootLayout