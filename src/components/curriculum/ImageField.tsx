import { FormControl, FormField, FormItem, FormLabel } from "#/ui/form"
import { Button } from "#/ui/button"

import { ImageFieldProps, ImagePreview } from "@/interfaces/form.interface"
import { useState, useCallback, ChangeEvent } from 'react'
import { useController } from "react-hook-form"
import { Camera, X } from "lucide-react"

const ImageField = ({ name, label, control }: ImageFieldProps) => {
  const [preview, setPreview] = useState<ImagePreview>()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * @param field - es el control del formulario
   * @implements useController, es un hook que nos permite controlar el campo del formulario
   * los parámetros que recibe useController los obtenemos del useFormContext (sección)
   */
  const { field } = useController({ name, control, defaultValue: null })

  /**
   * Este método permite manejar la carga de imágenes a través del input de tipo file
   * @implements useCallback, es un hook que nos permite memorizar una función;
   * La diferencia entre useCallback y useEffect es que useCallback memoriza una función,
   * mientras que useEffect memoriza un valor.
   */
  const handleImage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processImage(file)
  }, [field])

  /**
   * Crea una instancia de FileReader para leer la imagen, nos ayuda a actualizar la vista previa
   * @param file - El archivo de imagen a procesar.
   */
  const processImage = (file: File) => {
    setIsLoading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      field.onChange(file)
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  /** Elimina la vista previa de la imagen y el campo del formulario */
  const removeImage = useCallback(() => {
    setPreview(null)
    field.onChange(null)
  }, [field])

  if (isLoading) return <div>Cargando...</div>

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
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                    >
                      <span>Subir imagen</span>
                      <input
                        id="file-upload"
                        name={name}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG</p>
                  <p className="text-xs leading-5 text-gray-600">hasta 5MB</p>
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