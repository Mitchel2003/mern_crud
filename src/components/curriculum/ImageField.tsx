import { FormControl, FormField, FormItem, FormLabel } from "#/ui/form"
import { Button } from "#/ui/button"

import { useController, Control } from "react-hook-form"
import { useState, useCallback, ChangeEvent } from 'react'
import { Camera, X } from "lucide-react"

interface ImageFieldProps {
  name: string;
  label: string;
  control: Control<any>;
}
type ImagePreview = string | null

const ImageField = ({ name, label, control }: ImageFieldProps) => {
  const [preview, setPreview] = useState<ImagePreview>()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * @param field - is the form control
   * @implements useController, is a hook that allows us to control the form field
   * the params that receive useController we get from the useFormContext (section)
   */
  const { field } = useController({ name, control, defaultValue: null })

  /**
   * This method allows handle the image upload through the input type file
   * @implements useCallback, is a hook that allows us to memorize a function;
   * The difference between useCallback and useEffect is that useCallback memorize a function,
   * while useEffect memorize a value.
   */
  const handleImage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processImage(file)
  }, [field])

  /**
   * Create a FileReader instance to read the image, helps us to update the preview
   * @param file - The image file to be processed.
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

  /** Remove the preview image and the form field */
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
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Vista previa del equipo"
                    className="w-full h-48 object-cover rounded-md"
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
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 10MB</p>
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