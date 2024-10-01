import { FormItem, FormLabel, FormControl } from "#/ui/form";
import { Card, CardContent } from "#/ui/card";
import { Button } from "#/ui/button";

import { IterableCardCustomProps } from '@/interfaces/form.interface';
import { useFieldArray } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';
import React from 'react';

const IterableCardCustom = ({ name, fields, titleButton, control }: IterableCardCustomProps) => {
  const { fields: items, append, remove } = useFieldArray({ control, name })

  const handleAppend = () => {
    const initialValue = {} as Record<string, string>
    const newItem = fields.reduce((acc, field) => { acc[field.name] = ''; return acc }, initialValue)
    append(newItem)
  }

  return (
    <>
      <Button
        size="sm"
        type="button"
        variant="outline"
        className='flex h-full'
        onClick={handleAppend}
      >
        {titleButton ?? ''}
        <PlusCircle
          className={`h-auto w-auto md:h-[3vh] md:w-[3vw] ${titleButton && 'ml-2'}`}
        />
      </Button>

      {items.map((item, index) => (
        <Card key={item.id} className="bg-white relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <FormItem key={field.name}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {React.cloneElement(field.component, {
                      name: `${name}.${index}.${field.name}`,
                      placeholder: field.placeholder,
                    })}
                  </FormControl>
                </FormItem>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default IterableCardCustom

{/* to use this component you need to pass the fields as props */ }

// const supplierFields: CustomFieldProps[] = [
//     {
//       name: "name",
//       label: "Nombre",
//       placeholder: "Nombre del proveedor",
//       component: <InputField control={methods.control} name="name" />
//     },
//     {
//       name: "city",
//       label: "Ciudad",
//       placeholder: "Ciudad del proveedor",
//       component: <InputField control={methods.control} name="city" />
//     },
//     {
//       name: "phone",
//       label: "Teléfono",
//       placeholder: "Teléfono del proveedor",
//       component: <InputField control={methods.control} name="phone" />
//     },
//     {
//       name: "type",
//       label: "Tipo",
//       placeholder: "Seleccionar tipo",
//       component: (
//         <SelectField
//           name="type"
//           control={methods.control}
//           options={["distributor", "manufacturer"]}
//         />
//       )
//     }
//   ]


//<IterableCardCustom
//   name="suppliers"
//   title="Proveedores"
//   fields={supplierFields}
//   addButtonText="Agregar Proveedor"
//   control={methods.control}
// />



// export interface SupplierData {//type supplier
//   name: string;
//   city: string;
//   phone: string;
//   type: 'distributor' | 'manufacturer';
// }

// export type DetailsEquipmentProps = {
//   . . .
//   suppliers: SupplierData[];
// }