import { useSidebarContext } from '@/context/SidebarContext'
import { NavItemProps } from '@/interfaces/props.interface'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SidebarLinkProps {
  link: NavItemProps
  className?: string
}

export function SidebarLink({ link, className }: SidebarLinkProps) {
  const { open, animate } = useSidebarContext()
  const location = useLocation()
  const isActive = location.pathname === link.href

  return (
    <Link
      to={link.href || '/'}
      className={cn(
        "flex items-center gap-2 p-2",
        "text-neutral-700 dark:text-neutral-200",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "rounded-md transition-colors",
        isActive && "bg-neutral-100 dark:bg-neutral-800",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm font-medium whitespace-pre",
          "transition-transform duration-150",
          "hover:translate-x-1"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  )
}