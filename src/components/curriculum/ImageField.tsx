import { Form, FormControl, FormField, FormItem, FormLabel } from "#/ui/form"
import { Card, CardContent } from "#/ui/card"
import { Button } from "#/ui/button"
import { Input } from "#/ui/input"

import { Image } from '@/interfaces/form.interface'
import { Camera, Upload, X } from "lucide-react"
import { useState, ChangeEvent } from 'react'
import { useForm } from "react-hook-form"

interface ImageFieldProps { name: string, label: string }

const ImageField = ({ name, label }: ImageFieldProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [image, setImage] = useState<Image>()
  const form = useForm()

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => { setImage(reader.result as string) }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(undefined)
    form.setValue(name, null)
  }

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
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
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          handleImage(e)
                          field.onChange(e.target.files?.[0] || null)
                        }}
                        {...field}
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