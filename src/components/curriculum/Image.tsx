import { FormControl, FormField, FormItem, FormLabel } from '#/ui/form'
import { Button } from '#/ui/button'

import { ThemeContextProps } from '@/interfaces/context.interface'
import { ControlProps } from '@/interfaces/form.interface'
import { useController } from 'react-hook-form'
import useCallback from '@/hooks/useCallback'
import { Camera, X } from 'lucide-react'
import { useState } from 'react'

interface ImageFieldProps extends ControlProps, ThemeContextProps {
  name: string;
  label: string;
}

const ImageField = ({ name, label, control, theme }: ImageFieldProps) => {
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
              className={`flex px-auto justify-center rounded-lg border border-dashed
                ${preview ? 'py-[2vh]' : 'py-[6vh]'}
                ${theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-600'
                  : 'bg-gray-50 border-gray-900/25'
                }`
              }
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
                  <Camera className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />

                  <div className="flex w-full mt-4 text-sm justify-center leading-6">
                    <label
                      htmlFor={`file-upload-${name}`}
                      className={`relative font-semibold rounded-md cursor-pointer
                        ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}
                      `}
                    >
                      <span className={`${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`} >Subir imagen</span>
                      <input
                        id={`file-upload-${name}`}
                        name={name}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={callback?.handler}
                      />
                    </label>
                  </div>
                  <p className={`text-xs leading-5 ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
                    PNG, JPG, JPEG hasta 5MB
                  </p>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem >
      )}
    />
  )
}

export default ImageField