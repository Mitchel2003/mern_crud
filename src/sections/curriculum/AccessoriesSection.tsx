import IterableCustomCard from "#/curriculum/fields/IterableCard"
import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import InputField from "#/curriculum/fields/Input"

import { CardFieldProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"

type AccessoriesProps = {
  accessories: {
    name: string;
    type: string;
    series: string;
    model: string;
  }[];
}

const AccessoriesSection = () => {
  const methods = useForm<AccessoriesProps>()

  const supplierFields: CardFieldProps[] = [
    { name: "name", label: "Nombre", placeholder: "Nombre del accesorio", component: <InputField control={methods.control} name="name" /> },
    { name: "type", label: "Tipo", placeholder: "Tipo del accesorio", component: <InputField control={methods.control} name="type" /> },
    { name: "series", label: "Serie", placeholder: "Serie del accesorio", component: <InputField control={methods.control} name="series" /> },
    { name: "model", label: "Modelo", placeholder: "Modelo del accesorio", component: <InputField control={methods.control} name="model" /> },
  ]

  return (
    <FormProvider {...methods}>

      <div className="space-y-6">
        <HeaderCustom
          to="section"
          title="Accesorios"
          description="Máximo 10 accesorios"
          icon="alert"
        />

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