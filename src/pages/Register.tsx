import FormatDevice from "@/sections/curriculum/FormatDevice"

const Register = () => {
  return (
    <FormatDevice />
  )
}

//CV - Curriculum Vitae
export default Register











import React, { useState, useRef } from 'react'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EquipmentInfoForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImagePreview(null)
    form.setValue('equipmentImage', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6">Información General</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input className="bg-white" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="brand"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="model"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="serie"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serie</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="healthRecord"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registro Sanitario</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <FormField
                  name="equipmentImage"
                  control={form.control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Imagen del Equipo</FormLabel>
                      <FormControl>
                        <div
                          className={cn(
                            "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
                            "cursor-pointer transition-colors duration-200 ease-in-out",
                            "hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                          )}
                          onClick={triggerFileInput}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              triggerFileInput()
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label="Subir imagen del equipo"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageUpload(e)
                              onChange(e.target.files?.[0] || null)
                            }}
                            {...field}
                          />
                          {imagePreview ? (
                            <div className="relative w-full h-48">
                              <img
                                src={imagePreview}
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
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" className="bg-primary text-white">
                Guardar Información
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}