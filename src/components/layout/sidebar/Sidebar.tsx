import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/ui/tooltip"
import { SidebarProps, NavItemProps as NavItem } from "@/types/sidebar.type"
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/avatar"
import { useSidebarContext } from "@/context/SidebarContext"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "#/ui/button"
import { cn } from "@/lib/utils"

import { SidebarLink } from "./SidebarLink"
import { SidebarLogo } from "./SidebarLogo"
import { links } from "@/utils/constants"

export const Sidebar = ({ auth, user }: SidebarProps) => {
  const { isExpanded, toggleSidebar } = useSidebarContext()
  const isMobile = useIsMobile()

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 240 : 64,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800",
        "shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <SidebarLogo expanded={isExpanded} />
        {!isMobile && <MobileTooltip isExpanded={isExpanded} toggleSidebar={toggleSidebar} />}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {links(auth).map((link: NavItem, index: number) => (
            <li key={index}>
              <SidebarLink link={link} expanded={isExpanded} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center space-x-3">
          <Avatar>
            {/** lanzamos una imagen de una api publica */}
            <AvatarImage src={user?.photoUrl ?? 'https://github.com/shadcn.png'} alt={user?.username ?? 'guest'} />
            <AvatarFallback>{user?.username.charAt(0) ?? ''}</AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden"
              >
                {user?.username}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

const MobileTooltip = ({
  isExpanded,
  toggleSidebar
}: { isExpanded: boolean, toggleSidebar: () => void }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isExpanded ? "chevron-left" : "chevron-right"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? <ChevronLeft /> : <ChevronRight />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isExpanded ? "Collapse sidebar" : "Expand sidebar"}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
