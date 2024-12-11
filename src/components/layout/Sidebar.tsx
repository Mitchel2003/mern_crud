import { IconX, IconMenu2, IconSettings } from '@tabler/icons-react'
import { useSidebarContext } from '@/context/SidebarContext'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { links } from '@/utils/constants'
import { cn } from '@/lib/utils'

import { SidebarBody } from '#/layout/sidebar/SidebarBody'
import { SidebarLink } from '#/layout/sidebar/SidebarLink'
import { Logo, LogoIcon } from '#/layout/sidebar/Logo'

export function Sidebar() {
  const { open, setOpen } = useSidebarContext()
  const isMobile = useIsMobile()

  return (
    <>
      {/* Botón móvil para abrir/cerrar */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "md:hidden fixed top-4 left-4 z-50",
          "p-2 rounded-md",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-neutral-800"
        )}
      >
        {open ? <IconX /> : <IconMenu2 />}
      </button>

      {/* Sidebar Desktop */}
      <motion.div
        initial={false}
        animate={{
          width: isMobile ? '100%' : (open ? 240 : 70),
          x: isMobile ? (open ? 0 : '-100%') : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 h-screen",
          "bg-white dark:bg-neutral-900",
          "border-r border-neutral-200 dark:border-neutral-800",
          "z-40",
          isMobile && "w-full"
        )}
      >
        <SidebarBody className="flex flex-col justify-between">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="px-2 py-4">
              {open ? <Logo /> : <LogoIcon />}
            </div>

            <nav className="mt-8 flex flex-col gap-2">
              {links().navUserItems.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>
          </div>

          {/* Footer del Sidebar */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <SidebarLink
              link={{
                label: "Configuración",
                href: "/settings",
                icon: <IconSettings className="w-5 h-5" />
              }}
            />
          </div>
        </SidebarBody>
      </motion.div>

      {/* Overlay para móvil */}
      {isMobile && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
          )}
        </AnimatePresence>
      )}
    </>
  )
}
