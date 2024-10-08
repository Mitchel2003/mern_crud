import { ControlProps, OptionsCheckProps } from '@/interfaces/form.interface'
import { ThemeContextProps } from '@/interfaces/context.interface'
import { useController } from 'react-hook-form'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusCheckProps extends ThemeContextProps, ControlProps {
  name: string
  options: OptionsCheckProps[]
}
const StatusCheck = ({ theme, name, control, options }: StatusCheckProps) => {
  const { field } = useController({ name, control })

  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <button
          type="button"
          key={option.name}
          onClick={() => field.onChange(option.name)}
          className={cn(
            'flex w-full p-4 px-8 rounded-lg items-center justify-center transition-all duration-200 ease-in-out',
            'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2',
            `focus:ring-${option.color}-500`,
            //conditional classes
            theme === 'dark' ? 'text-white' : 'text-gray-800',
            field.value !== option.name
              ? (theme === 'dark' ? `bg-zinc-700` : `bg-gray-100`)
              : (theme === 'dark' ? `bg-${option.color}-600` : `bg-${option.color}-400`)
          )}
        >
          <Check
            className={cn(
              'w-6 h-6 mr-2',
              field.value === option.name ? 'block' : 'hidden'
            )}
          />
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default StatusCheck