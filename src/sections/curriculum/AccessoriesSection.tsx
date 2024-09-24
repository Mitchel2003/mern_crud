import { FormField, FormItem, FormLabel, FormControl } from "#/ui/form";
import { Card, CardContent } from "#/ui/card";
import { Button } from "#/ui/button";
import { Input } from "#/ui/input";


import { useFieldArray, useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { AccessoriesSection as TypeAccessories } from "@/interfaces/form.interface";

const AccessoriesSection = () => {
  const form = useForm<TypeAccessories>()

  const { fields, append } = useFieldArray({ control: form.control, name: "accessories" });

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Accesorios</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
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
  )
}

export default AccessoriesSection