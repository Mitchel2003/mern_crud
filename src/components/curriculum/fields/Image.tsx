import { FormControl, FormField, FormItem, FormLabel } from '#/ui/form'
import { Button } from '#/ui/button'

import { ImageFieldProps } from '@/interfaces/form.interface'
import { useController } from 'react-hook-form'
import useCallback from '@/hooks/useCallback'
import { Camera, X } from 'lucide-react'
import { useState } from 'react'

const ImageField = ({ name, label, control }: ImageFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const { field } = useController({ name, control, defaultValue: null })
  const callback = useCallback({ field, setPreview })

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel htmlFor={`container-${name}`}>{label}</FormLabel>
          <FormControl>
            <div
              id={`container-${name}`}
              className={`flex px-auto justify-center rounded-lg border border-dashed border-gray-900/25
                ${preview ? 'py-[2vh]' : 'py-[6vh]'}
              `}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Vista previa del equipo"
                    className="w-40 h-40 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={callback?.remove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />

                  <div className="flex w-full justify-center text-sm mt-4 leading-6 text-gray-600">
                    <label
                      htmlFor={`file-upload-${name}`}
                      className="relative cursor-pointer rounded-md font-semibold bg-white"
                    >
                      <span>Subir imagen</span>
                      <input
                        id={`file-upload-${name}`}
                        name={name}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={callback?.handler}
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG hasta 5MB</p>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default ImageField