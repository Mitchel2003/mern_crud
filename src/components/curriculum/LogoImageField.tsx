import { ImagePreview, LogoImageFieldProps } from '@/interfaces/form.interface'

import { useController } from 'react-hook-form'
import useCallback from '@/hooks/useCallback'
import { Building2 } from 'lucide-react'
import { useState } from 'react'


const LogoImageField = ({ name, control, label }: LogoImageFieldProps) => {
  const [preview, setPreview] = useState<ImagePreview>(null)
  const { field } = useController({ name, control, defaultValue: null })

  const { handler, remove } = useCallback()

  handler(field, setPreview)
  remove(field, setPreview)

  return (
    <div className="relative w-32 h-32 mx-auto">
      {label && <label className="text-sm font-medium">{label}</label>}

      {preview ? (
        <>
          <img
            src={preview}
            alt="Logo preview"
            className="w-full h-full object-cover rounded-full"
          />
        </>
      ) : (
        <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center">
          <Building2 className="text-gray-400 w-16 h-16" />
        </div>
      )}
    </div>
  )
}

export default LogoImageField