import { TechnicalCharacteristicsSection as TypeTechnicalCharacteristics } from "@/interfaces/form.interface";

import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "#/ui/input";

const TechnicalCharacteristicsSection = () => {
  const form = useForm<TypeTechnicalCharacteristics>()

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Características Técnicas</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
  )
}

export default TechnicalCharacteristicsSection