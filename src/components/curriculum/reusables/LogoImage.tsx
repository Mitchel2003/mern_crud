import { ThemeContextProps } from '@/interfaces/context.interface'
import { Control, useController } from 'react-hook-form'
import { Building2 } from 'lucide-react'

interface LogoImageProps extends ThemeContextProps {
  name: string
  label?: string
  control: Control<any>
  className?: string
}
const LogoImage = ({ name, control, label, theme }: LogoImageProps) => {
  const { field } = useController({ name, control, defaultValue: null })

  return (
    <div className="flex flex-col items-center space-y-2 w-full max-w-md mx-auto">
      {/* -------------------- Label -------------------- */}
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium
            ${theme === 'dark'
              ? 'text-gray-300'
              : 'text-zinc-700'
            }`}
        >
          {label}
        </label>
      )}
      {/* ---------------------------------------------------------------- */}

      {/* -------------------- Logo Image -------------------- */}
      <div className={`relative w-full aspect-[3/1] rounded-md overflow-hidden border shadow-sm
        ${theme === 'dark'
          ? 'border-zinc-600'
          : 'border-gray-200'
        }`}
      >
        {field.value ? (
          <img
            src={field.value}
            alt="Logo de la empresa"
            className="bg-white"
          />
        ) : (
          <div className={`flex items-center justify-center w-full h-full
            ${theme === 'dark'
              ? 'bg-zinc-700 text-zinc-100'
              : 'bg-gray-50 text-gray-400'
            }`}
          >
            <Building2 className={`w-16 h-16
              ${theme === 'dark'
                ? 'text-zinc-300'
                : 'text-gray-400'
              }`}
            />
          </div>
        )}
      </div>
      {/* ---------------------------------------------------------------- */}

      <p className={`text-xs
        ${theme === 'dark'
          ? 'text-zinc-300'
          : 'text-gray-500'
        }`}
      >
        Recomendado: imagen PNG o SVG con fondo transparente, proporción 3:1
      </p>
    </div >
  )
}

export default LogoImage