import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Button } from "#/ui/button";

import { Image } from "@/interfaces/form.interface";
import { useForm } from "react-hook-form";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useRef,
  useState,
  ChangeEvent,
  MouseEvent
} from "react";

interface ImageUploadFieldProp { name: string; label: string }

/**
 * Allows us to upload an image to the database
 * @param name - Corresponds to name of FormField and context of this component
 * @param label - Is the label of the field
 */
const ImageFieldhg = ({ name, label }: ImageUploadFieldProps) => {
  const [image, setImage] = useState<Image>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<HTMLInputElement>() //handle

  /**
   * Handle the image upload
   * @param event The handle event
   */
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as Image)
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  /**
   * Remove the image from the state and reset the file input value
   * @description fileInputRef contains the file input element
   */
  const removeImage = (e: MouseEvent) => {
    e.stopPropagation()
    setImage(undefined)
    form.setValue(name, null)
    form.control.current!.value = ''
  }

  /** Trigger the file input element */
  const triggerFileInput = () => form.control.current?.click()

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              className={cn(
                "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
                "cursor-pointer transition-colors duration-200 ease-in-out",
                "hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              )}
              onClick={triggerFileInput}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput() }}
              tabIndex={0}
              role="button"
              aria-label="Subir imagen del equipo"
            >
              <input
                ref={(e) => { form.control.current = e }}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => {
                  handleImage(e)
                  onChange(e.target.files?.[0] || null)
                }}
                {...field}
              />
              {image ? (
                <div className="relative w-full h-48">
                  <img
                    src={image}
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
                  <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600">
                    <span className="font-semibold text-primary hover:text-primary-dark">
                      Subir imagen
                    </span>
                    <span className="mt-1">o arrastrar y soltar</span>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-1">PNG, JPG, GIF hasta 10MB</p>
                </div>
              )}
            </div>
          </FormControl>
        </FormIte>
      )}
    />
  )
}