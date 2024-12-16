import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { Link, useLocation } from "react-router-dom"
import { NavItemProps } from "@/types/sidebar.type"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SidebarLinkProps {
  link: NavItemProps
  expanded: boolean
}

export const SidebarLink = ({ link, expanded }: SidebarLinkProps) => {
  const location = useLocation()
  const isActive = location.pathname === link.href

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={link.href ?? '/'}
            className={cn(
              "flex items-center p-2 rounded-lg transition-colors",
              "hover:bg-gray-200 dark:hover:bg-neutral-700",
              isActive && "bg-gray-200 dark:bg-neutral-700"
            )}
          >
            <link.icon className={cn(
              "h-5 w-5",
              isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
            )} />
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "ml-3 whitespace-nowrap overflow-hidden",
                  isActive && "font-medium"
                )}
              >
                {link.label}
              </motion.span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{link.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}