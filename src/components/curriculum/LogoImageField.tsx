import { LogoImageFieldProps } from '@/interfaces/form.interface'
import { Building2 } from 'lucide-react'
import { useController } from 'react-hook-form'

const LogoImageField = ({ name, control, label }: LogoImageFieldProps) => {
  const { field } = useController({ name, control, defaultValue: null })

  return (
    <div className="relative w-32 h-32 mx-auto">
      {label && <label className="text-sm font-medium">{label}</label>}

      {field.value ? (
        <img
          src={field.value}
          alt="Logo preview"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center">
          <Building2 className="text-gray-400 w-16 h-16" />
        </div>
      )}
    </div>
  )
}

export default LogoImageField