import { ImagePreview, UserImageFieldProps } from '@/interfaces/form.interface'
import { Button } from '#/ui/button'

import { useController } from 'react-hook-form'
import { User, Camera, X } from 'lucide-react'
import useCallback from '@/hooks/useCallback'
import { useState } from 'react'


const UserImageField = ({ name, control, label }: UserImageFieldProps) => {
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
            alt="User preview"
            className="w-full h-full object-cover rounded-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0"
            onClick={() => remove}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center">
          <User className="text-gray-400 w-16 h-16" />
        </div>
      )}

      {/* icon */}
      <label
        htmlFor={`user-image-${name}`}
        className="absolute bottom-0 right-0 cursor-pointer"
      >
        <div className="bg-primary text-primary-foreground rounded-full p-2">
          <Camera className="w-5 h-5" />
        </div>
      </label>

      <input
        id={`user-image-${name}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={() => handler}
      />
    </div>
  )
}

export default UserImageField