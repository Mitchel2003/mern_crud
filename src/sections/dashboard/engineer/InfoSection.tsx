import { ThemeContextProps, User } from '@/interfaces/context.interface'
import { Card } from '#/ui/card'
import { cn } from '@/lib/utils'

interface InfoSectionProps extends ThemeContextProps { auth: User }
const InfoSection = ({ theme, auth }: InfoSectionProps) => {
  const complement = auth?.username.slice(1).toLowerCase()
  const first = auth?.username.charAt(0).toUpperCase()

  return (
    <Card className={cn(
      'text-center space-y-4 p-10',
      'backdrop-filter backdrop-blur-lg hover:shadow-md',
      theme === 'dark'
        ? 'bg-zinc-800/40 hover:shadow-purple-900/60'
        : 'bg-white/50 hover:shadow-purple-500/60'
    )}>
      <h1 className={cn(
        'text-4xl font-bold',
        theme === 'dark' ? 'text-purple-100' : 'text-purple-400'
      )}>
        Bienvenido {first}{complement}
      </h1>
      <p className={cn(
        'text-xl',
        theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'
      )}>
        Aquí encontraras tu calendario e información relevante
      </p>
    </Card>
  )
}

export default InfoSection