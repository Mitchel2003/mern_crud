import { ThemeContextProps, User } from '@/interfaces/context.interface'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InfoSectionProps extends ThemeContextProps { auth: User }
const InfoSection = ({ theme, auth }: InfoSectionProps) => {
  return (
    <motion.section variants={scaleVariants} className="text-center space-y-4">
      <h1 className={cn(
        'text-4xl font-bold',
        theme === 'dark' ? 'text-purple-100' : 'text-purple-400'
      )}>
        Bienvenido {auth?.username}
      </h1>
      <p className={cn(
        'text-xl',
        theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
      )}>
        Aquí administras tu calendario y ves tus estadísticas
      </p>
    </motion.section>
  )
}

export default InfoSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
}