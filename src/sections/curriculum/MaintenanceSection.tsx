import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "#/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Checkbox } from "#/ui/checkbox";
import { useForm } from "react-hook-form";

import { MaintenanceSection as TypeMaintenance } from "@/interfaces/form.interface";

const MaintenanceSection = () => {
  const form = useForm<TypeMaintenance>()

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Mantenimiento</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          name="maintenance"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mantenimiento</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
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
                  {/* field.value is an array of strings */}
                  {['preventivo', 'correctivo', 'predictivo'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={field.value?.includes(type)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value ?? [], type]
                            : [...field.value ?? []].filter((value: string) => value !== type);
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            ? [...field.value, manual]
                            : [...field.value].filter((value: string) => value !== manual);
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
  )
}

export default MaintenanceSection