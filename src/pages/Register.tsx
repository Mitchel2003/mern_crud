import { Form, FormField, FormItem, FormLabel, FormControl /* FormDescription */ } from "#/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "#/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "#/ui/popover"
import { Separator } from "#/ui/separator"
import { Textarea } from "#/ui/textarea"
import { Calendar } from "#/ui/calendar"
import { Checkbox } from "#/ui/checkbox"
import { Button } from "#/ui/button"
import { Input } from "#/ui/input"

import { CalendarIcon, PlusCircle, User, Camera, /* Upload, */ X } from 'lucide-react'
import { useForm, useFieldArray } from "react-hook-form"
import { format } from 'date-fns'

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

const Register = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm()

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "accessories"
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
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
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-3xl font-bold text-center">Formato CV - Equipo Biomédico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                name="entity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Entidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Seleccionar entidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entidad1">Entidad 1</SelectItem>
                        <SelectItem value="entidad2">Entidad 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="service"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Servicio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="servicio1">Servicio 1</SelectItem>
                        <SelectItem value="servicio2">Servicio 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-8" />

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
                            ref={(e) => {
                              fileInputRef.current = e;
                              field.ref(e);
                            }}
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

            <Separator className="my-8" />

            <div className="space-y-1 md:space-y-6">

              {/* device details */}
              <h3 className="text-2xl font-bold">Detalles</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="purchase_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Compra</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-md border bg-white"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  name="installation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instalación</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-md border bg-white"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  name="start_operation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inicio de Operación</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-md border bg-white"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* datails => acquisition */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="type_acquisition"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Adquisición</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="compra">Compra</SelectItem>
                          <SelectItem value="comodato">Comodato</SelectItem>
                          <SelectItem value="alquiler">Alquiler</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="warranty"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantía</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar garantía" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="na">N/A</SelectItem>
                          <SelectItem value="6meses">6 meses</SelectItem>
                          <SelectItem value="1ano">1 año</SelectItem>
                          <SelectItem value="2anos">2 años</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* datails => representante */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="representative"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Representante</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="city_representative"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone_representative"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* datails => distributor */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="distributor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribuidor</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="city_distributor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone_distributor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* datails => manufacturer */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="manufacturer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="country_manufacturer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone_manufacturer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* datails => year manufacture */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  name="year_manufacture"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año de Fabricación</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8" />

            {/* technical characteristics */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Características Técnicas</h3>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  name="voltage"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voltaje</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="amperage"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amperaje</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="power"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potencia</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  name="frequency"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="capacity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="pressure"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presión (PSI)</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 gap-6">
                <FormField
                  name="speed"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Velocidad</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="temperature"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temp (C°)</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="weight"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="humidity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humedad</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Equipo</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="device"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fijo">Fijo</SelectItem>
                          <SelectItem value="movil">Móvil</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="classification_by_use"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación por Uso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="medico">Médico</SelectItem>
                          <SelectItem value="basico">Básico</SelectItem>
                          <SelectItem value="apoyo">Apoyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  name="classification_biomedical"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación Biomédica</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                          <SelectItem value="tratamiento">Tratamiento y Mantenimiento de Vida</SelectItem>
                          <SelectItem value="prevencion">Prevención</SelectItem>
                          <SelectItem value="rehabilitacion">Rehabilitación</SelectItem>
                          <SelectItem value="analisis">Análisis de Laboratorio</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="technology_predominant"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tecnología Predominante</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico'].map((tech) => (
                            <div key={tech} className="flex items-center space-x-2">
                              <Checkbox
                                id={tech}
                                checked={field.value?.includes(tech)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), tech]
                                    : (field.value || []).filter((value: string) => value !== tech);
                                  field.onChange(updatedValue);
                                }}
                              />
                              <label htmlFor={tech} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {tech.charAt(0).toUpperCase() + tech.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="risk"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Riesgo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar riesgo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="muy_alto">Muy alto (III)</SelectItem>
                          <SelectItem value="alto">Alto (IIb)</SelectItem>
                          <SelectItem value="moderado">Moderado (IIa)</SelectItem>
                          <SelectItem value="bajo">Bajo (I)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Mantenimiento</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="maintenance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mantenimiento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="propio">Propio</SelectItem>
                          <SelectItem value="contratado">Contratado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type_maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Mantenimiento</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {['preventivo', 'correctivo', 'predictivo'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={field.value?.includes(type)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), type]
                                    : (field.value || []).filter((value: string) => value !== type);
                                  field.onChange(updatedValue);
                                }}
                              />
                              <label htmlFor={type} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="frequency_maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia de Mantenimiento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccionar frecuencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3meses">3 meses</SelectItem>
                          <SelectItem value="4meses">4 meses</SelectItem>
                          <SelectItem value="6meses">6 meses</SelectItem>
                          <SelectItem value="12meses">12 meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manuales</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {['servicio', 'componentes', 'usuario', 'despiece'].map((manual) => (
                            <div key={manual} className="flex items-center space-x-2">
                              <Checkbox
                                id={manual}
                                checked={field.value?.includes(manual)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), manual]
                                    : (field.value || []).filter((value: string) => value !== manual);
                                  field.onChange(updatedValue);
                                }}
                              />
                              <label htmlFor={manual} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {manual.charAt(0).toUpperCase() + manual.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Accesorios</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ name: '', type: '', series: '', model: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Accesorio
                </Button>
              </div>
              {fields.map((field, index) => (
                <Card key={field.id} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`accessories.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`accessories.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`accessories.${index}.series`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serie</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`accessories.${index}.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Características</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="characteristics"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Características</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese las características del equipo"
                          className="min-h-[100px] bg-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="recommendations_manufacturer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recomendaciones del Fabricante</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese las recomendaciones del fabricante"
                          className="min-h-[100px] bg-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Referencia del Ingeniero Encargado</h3>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  name="service_engineer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingeniero de Servicio</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="invima_registration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro INVIMA</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button type="submit">Guardar Hoja de Vida</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default Register