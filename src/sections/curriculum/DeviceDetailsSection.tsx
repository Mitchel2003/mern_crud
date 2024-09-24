import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "#/ui/popover";
import { Calendar } from "#/ui/calendar";
import { Button } from "#/ui/button";
import { Input } from "#/ui/input";

import { DeviceDetailsSection as TypeDeviceDetails } from '@/interfaces/form.interface';
import { CalendarIcon } from 'lucide-react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';

const DeviceDetailsSection = () => {
  const form = useForm<TypeDeviceDetails>()

  return (
    <>
      {/* first component */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Detalles del Dispositivo</h3>
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
                        className={`w - full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
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
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            name="installation_date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Instalación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w - full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
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
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            name="start_operation_date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Inicio de Operación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w - full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
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
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem >
            )}
          />
        </div >
      </div >


      {/* second component */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Detalles de Adquisición</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white"
                    {...field}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
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
      </div>

      {/* third component */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Representante</h3>
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
      </div>


      {/* fourth component */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Distribuidor</h3>
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
      </div>


      {/* fifth component */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Fabricante</h3>
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
      </div>

      {/* sixth component */}
      <div className="space-y-6">
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
    </>
  )
}

export default DeviceDetailsSection