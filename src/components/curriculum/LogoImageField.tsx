import { LogoImageFieldProps } from '@/interfaces/form.interface'
import { useController } from 'react-hook-form'
import { Building2 } from 'lucide-react'

const LogoImageField = ({ name, control, label }: LogoImageFieldProps) => {
  const { field } = useController({ name, control, defaultValue: null })

  return (
    <div className="flex flex-col items-center space-y-2 w-full max-w-md mx-auto">
      {label && (<label htmlFor={name} className="text-sm font-medium text-gray-700"> {label} </label>)}
      <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border border-gray-200 shadow-sm">
        {field.value ? (
          <img
            src={field.value}
            alt="Logo de la empresa"
            className="bg-white"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-50">
            <Building2 className="text-gray-400 w-16 h-16" />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Recomendado: imagen PNG o SVG con fondo transparente, proporción 3:1
      </p>
    </div >
  )
}

export default LogoImageField