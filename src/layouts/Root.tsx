import { DialogConfirmProvider as ConfirmProvider } from '@/context/DialogConfirmContext'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AnimatedBackground as AnimatedBG } from '#/layout/AnimatedBackground'
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfirmProvider>
        <SidebarProvider>
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <SidebarInset>
            <AnimatedBG>
              <Navbar />
              <Outlet />
              <Footer />
            </AnimatedBG>
          </SidebarInset>

        </SidebarProvider>
      </ConfirmProvider>
    </LocalizationProvider>

    {/* Componentes UI globales */}
    <Toaster />
    <ScrollToTop />
    <LoadingScreen />
  </>
)

export default RootLayout