import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface SidebarLogoProps { expanded: boolean }

export const SidebarLogo = ({ expanded }: SidebarLogoProps) => {
  return (
    <Link
      to="/"
      className="font-normal flex items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      {expanded && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2 font-medium whitespace-pre overflow-hidden"
        >
          Acet Labs
        </motion.span>
      )}
    </Link>
  )
}

