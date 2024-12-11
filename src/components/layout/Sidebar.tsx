import { useSidebarContext } from '@/context/SidebarContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  IconDashboard,
  IconFileText,
  IconMap,
  IconTool
} from '@tabler/icons-react'

interface SidebarLink {
  label: string
  href: string
  icon: React.ReactNode
}

const links: SidebarLink[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <IconDashboard className="w-5 h-5" />
  },
  {
    label: 'Curriculums',
    href: '/form/cvs',
    icon: <IconFileText className="w-5 h-5" />
  },
  {
    label: 'Countries',
    href: '/location/countries',
    icon: <IconMap className="w-5 h-5" />
  },
  {
    label: 'Maintenance',
    href: '/form/maintenance/new',
    icon: <IconTool className="w-5 h-5" />
  }
]

export function Sidebar() {
  const { open } = useSidebarContext()

  return (
    <motion.div
      initial={false}
      animate={{
        width: open ? 220 : 70,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className={cn(
        "fixed top-0 left-0 h-screen",
        "bg-white dark:bg-neutral-900",
        "border-r border-neutral-200 dark:border-neutral-800",
        "flex flex-col gap-4 p-4",
        "z-50"
      )}
    >
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-2 p-2",
              "text-neutral-700 dark:text-neutral-200",
              "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              "rounded-md transition-colors"
            )}
          >
            {link.icon}
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                {link.label}
              </motion.span>
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  )
} 