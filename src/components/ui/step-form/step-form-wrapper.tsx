import { motion } from "framer-motion"
import { ReactNode } from "react"

const formVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 50, opacity: 0, transition: { ease: "easeOut" } }
}

interface FormWrapperProps {
  description: string;
  children: ReactNode;
  title: string;
}
const FormWrapper = ({ title, description, children }: FormWrapperProps) => {
  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          {title}
        </h2>
        <p className="text-sm text-neutral-300 md:text-base">{description}</p>
      </div>
      {children}
    </motion.div>
  )
}

export default FormWrapper