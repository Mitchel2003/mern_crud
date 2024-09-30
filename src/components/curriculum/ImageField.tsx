import { FormControl, FormField, FormItem, FormLabel } from "#/ui/form"
import { Button } from "#/ui/button"

import { ImageFieldProps } from "@/interfaces/form.interface"
import { useController } from "react-hook-form"
import useCallback from "@/hooks/useCallback"
import { Camera, X } from "lucide-react"
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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Vista previa del equipo"
                    className="w-full h-full object-cover rounded-md"
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
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor={`file-upload-${name}`}
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
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