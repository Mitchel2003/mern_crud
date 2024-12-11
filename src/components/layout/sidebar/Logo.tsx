import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Logo() {
  return (
    <Link
      to="/"
      className="font-normal flex items-center gap-2 text-sm text-black dark:text-white py-1"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        Tu Empresa
      </motion.span>
    </Link>
  )
}

export function LogoIcon() {
  return (
    <Link
      to="/"
      className="font-normal flex items-center text-sm text-black dark:text-white py-1"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  )
}