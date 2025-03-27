import { DialogConfirmProvider as ConfirmProvider } from '@/context/DialogConfirmContext'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useAuthContext } from '@/context/AuthContext'
import ScrollToTop from '@/hooks/ui/useScrollTop'
import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { AnimatedBackground as AnimatedBG } from '#/layout/AnimatedBackground'
import { SidebarInset, SidebarProvider } from '#/ui/sidebar'
import { LoadingScreen } from "#/ui/loading-screen"
import { Sidebar } from '#/layout/Sidebar'
import { Toaster } from '#/ui/toaster'
import Footer from '#/layout/Footer'
import Navbar from '#/layout/Navbar'

const RootLayout = () => {
  const [open, setOpen] = useState(true)
  const { user } = useAuthContext()
  useMemo(() => setOpen(user?.role !== 'client'), [user])
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ConfirmProvider>
          <SidebarProvider open={open} onOpenChange={setOpen}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <SidebarInset>
              <AnimatedBG>
                <Navbar />
                <main className="z-10">
                  <Outlet />
                </main>
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
}

export default RootLayout