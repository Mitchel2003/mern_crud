import IterableCustomCard from "#/curriculum/IterableCustomCard"
import InputField from "#/curriculum/Field"

import { AccessoriesProps, CustomFieldProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"

const AccessoriesSection = () => {
  const methods = useForm<AccessoriesProps>()

  const supplierFields: CustomFieldProps[] = [
    { name: "name", label: "Nombre", placeholder: "Nombre del accesorio", component: <InputField control={methods.control} name="name" /> },
    { name: "type", label: "Tipo", placeholder: "Tipo del accesorio", component: <InputField control={methods.control} name="type" /> },
    { name: "series", label: "Serie", placeholder: "Serie del accesorio", component: <InputField control={methods.control} name="series" /> },
    { name: "model", label: "Modelo", placeholder: "Modelo del accesorio", component: <InputField control={methods.control} name="model" /> },
  ]

  return (
    <FormProvider {...methods}>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Accesorios</h3>
          <p className="text-sm text-gray-500">Máximo 10 accesorios</p>
        </div>
        <IterableCustomCard
          name="accessories"
          fields={supplierFields}
          control={methods.control}
          titleButton="Agregar accesorio"
          limit={10}
        />
      </div>
    </FormProvider>
  )
}

export default AccessoriesSection