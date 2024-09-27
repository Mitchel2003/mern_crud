import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Textarea } from "#/ui/textarea";
import { useForm } from "react-hook-form";

import { CharacteristicsProps } from "@/interfaces/form.interface";

const CharacteristicsSection = () => {
  const form = useForm<CharacteristicsProps>()
  return (
    <div className="space-y-6">

      <h3 className="text-2xl font-bold">Características</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

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
  )
}

export default CharacteristicsSection
