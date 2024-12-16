import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SidebarLogoProps { expanded: boolean }

export const SidebarLogo = ({ expanded }: SidebarLogoProps) => {
  return (
    <Link
      to="/"
      className={cn(
        "font-normal flex items-center text-sm text-black dark:text-white py-1 relative z-20",
        expanded ? "ml-2" : "ml-0"
      )}
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      {expanded && (
        <motion.span
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, width: 0 }}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="ml-2 font-medium whitespace-pre overflow-hidden"
        >
          Gestion salud
        </motion.span>
      )}
    </Link>
  )
}

