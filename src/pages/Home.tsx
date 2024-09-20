import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"


import { CalendarIcon, CheckSquare, /*Heart,*/ User, Zap, Activity, Battery, Thermometer } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { format } from 'date-fns'






function Home() {

  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm();


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl font-bold text-center">PROCESO DE CALIDAD</CardTitle>
            <div className="text-center text-sm">PROCESO MANTENIMIENTO DE EQUIPOS BIOMEDICOS</div>
            <div className="text-center font-bold">FORMATO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO</div>
          </CardHeader>

          {/* primera parte */}
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CÓDIGO:</FormLabel>
                    <FormControl>
                      <Input placeholder="FMP-RL-01" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VERSIÓN:</FormLabel>
                    <FormControl>
                      <Input placeholder="02" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-bold text-lg">DATOS DEL CLIENTE</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CLIENTE:</FormLabel>
                      <FormControl>
                        <Input placeholder="IPS PROTEGER OCAÑA S.A.S" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contacto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CONTACTO:</FormLabel>
                      <FormControl>
                        <Input placeholder="607569257" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DIRECCIÓN:</FormLabel>
                      <FormControl>
                        <Input placeholder="CALLE 9 # 11-105, CONSULTORIO 2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>FECHA:</FormLabel>
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-bold text-lg">DATOS DEL EQUIPO</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nombreEquipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NOMBRE DEL EQUIPO:</FormLabel>
                      <FormControl>
                        <Input placeholder="MONITOR AUTOMATICO DE PRESION (MAPA)" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SERVICIO:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cardiologia">CARDIOLOGÍA</SelectItem>
                          <SelectItem value="otro">OTRO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UBICACIÓN:</FormLabel>
                      <FormControl>
                        <Input placeholder="CONSULTORIO 2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MARCA:</FormLabel>
                      <FormControl>
                        <Input placeholder="CONTEC" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MODELO:</FormLabel>
                      <FormControl>
                        <Input placeholder="ABPM50" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SERIE:</FormLabel>
                      <FormControl>
                        <Input placeholder="3547FG_2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>INVENTARIO:</FormLabel>
                      <FormControl>
                        <Input placeholder="#1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TIPO:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="funciona">FUNCIONA</SelectItem>
                          <SelectItem value="no_funciona">NO FUNCIONA</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ESTADO:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bueno">BUENO</SelectItem>
                          <SelectItem value="regular">REGULAR</SelectItem>
                          <SelectItem value="malo">MALO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-bold text-lg">ACTIVIDADES PREVENTIVAS</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tipoMantenimiento"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>TIPO DE MANTENIMIENTO</FormLabel>
                      <FormControl>
                        <div className="flex space-x-4">
                          <Checkbox
                            id="preventivo"
                            checked={field.value === 'preventivo'}
                            onCheckedChange={() => field.onChange('preventivo')}
                          />
                          <label
                            htmlFor="preventivo"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Preventivo
                          </label>
                          <Checkbox
                            id="correctivo"
                            checked={field.value === 'correctivo'}
                            onCheckedChange={() => field.onChange('correctivo')}
                          />
                          <label
                            htmlFor="correctivo"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Correctivo
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['voltaje', 'corriente', 'potencia', 'temperatura'].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name={item}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id={item}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label htmlFor={item} className="text-sm font-medium leading-none">
                          {item === 'voltaje' && <Zap className="h-4 w-4 inline mr-1" />}
                          {item === 'corriente' && <Activity className="h-4 w-4 inline mr-1" />}
                          {item === 'potencia' && <Battery className="h-4 w-4 inline mr-1" />}
                          {item === 'temperatura' && <Thermometer className="h-4 w-4 inline mr-1" />}
                          {item.toUpperCase()}
                        </label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-bold text-lg">REVISIÓN DE PARTES</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  "INSPECCIÓN FÍSICA", "SENSORES", "LÍNEA DE REACTIVOS", "REVISIÓN Y AJUSTES HIDRÁULICOS",
                  "DESEMPEÑO DEL EQUIPO", "TRANSDUCTORES", "LÍNEAS DE DESECHO", "REVISIÓN Y AJUSTES NEUMÁTICOS",
                  "ON/OFF", "RELES", "AGUJAS", "REVISIÓN Y AJUSTES MECÁNICOS",
                  "PANTALLA", "PEDAL", "JERINGAS", "REVISIÓN Y AJUSTES ELÉCTRICOS",
                  "TECLADO", "PIEZA DE ALTA", "CÁMARAS DE WBC/RBC", "VERIFICACIÓN DE POLO A TIERRA",
                  "OBJETIVOS", "JERINGA TRIPLE", "APERTURAS", "REVOLUCIONES Y/O VELOCIDAD"
                ].map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={item.toLowerCase().replace(/\s/g, '_')}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id={item.toLowerCase().replace(/\s/g, '_')}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          htmlFor={item.toLowerCase().replace(/\s/g, '_')}
                          className="text-sm font-medium leading-none"
                        >
                          {item}
                        </label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-bold text-lg">OBSERVACIONES Y/O ACTIVIDADES CORRECTIVAS</h3>
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese observaciones aquí"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center pt-6">

              <CardFooter className="flex flex-col space-y-4 bg-gray-100 p-6">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="fechaRealizacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FECHA DE REALIZACIÓN:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proximoMantenimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PRÓXIMO MANTENIMIENTO:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div>
                    <FormField
                      control={form.control}
                      name="ingenieroServicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>INGENIERO DE SERVICIO:</FormLabel>
                          <FormControl>
                            <Input {...field} defaultValue="RICARDO ANDRÉS LEMUS PORTILLO" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registroInvima"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>REG. INVIMA:</FormLabel>
                          <FormControl>
                            <Input {...field} defaultValue="RH-201609-473" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MP:</FormLabel>
                          <FormControl>
                            <Input {...field} defaultValue="NS 206-6841" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <FormLabel>RECIBIDO A SATISFACCIÓN</FormLabel>
                      <div className="h-20 border-2 border-gray-300 rounded-md"></div>
                    </div>
                    <div>
                      <FormLabel>FIRMA INGENIERO</FormLabel>
                      <div className="h-20 border-2 border-gray-300 rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end w-full">
                  <img src="/placeholder.svg?height=100&width=100" alt="ESE Hospital Logo" className="h-24 w-24" />
                </div>
              </CardFooter>
            </div>

            <div className="flex flex-col items-end">
              <Button type="submit">
                <CheckSquare className="mr-2 h-4 w-4" /> Guardar
              </Button>
            </div>
            {/* fin de la primera parte */}

          </CardContent>
        </Card>
      </form>
    </Form>

  )
}

export default Home