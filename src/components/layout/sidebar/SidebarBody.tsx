import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ComponentProps } from 'react'

interface SidebarBodyProps extends ComponentProps<typeof motion.div> {
  className?: string
  children: React.ReactNode
}

export function SidebarBody({ className, children, ...props }: SidebarBodyProps) {
  return (
    <motion.div
      className={cn(
        "flex h-full w-full flex-col p-4",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}