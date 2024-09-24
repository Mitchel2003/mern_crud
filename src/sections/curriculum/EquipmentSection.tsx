import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "#/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Checkbox } from "#/ui/checkbox";
import { useForm } from "react-hook-form";

import { EquipmentSection as TypeEquipment } from "@/interfaces/form.interface";

const EquipmentSection = () => {
  const form = useForm<TypeEquipment>()
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Equipo</h3>

      {/* first component "classification" */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormField
          name="type_device"
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
      </div>

      {/* second component "technology and risk" */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* technology_predominant */}
        <FormField
          name="technology_predominant"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tecnología Predominante</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {/* field.value is an array of strings,
                    so we can use the includes method to check
                    if the technology is already in the array */}
                  {['mecanico', 'electrico', 'electronico', 'hidraulico', 'neumatico'].map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={field.value?.includes(tech)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value ?? [], tech]
                            : [...field.value ?? []].filter((value: string) => value !== tech);
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
        {/* risk */}
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
  )
}

export default EquipmentSection