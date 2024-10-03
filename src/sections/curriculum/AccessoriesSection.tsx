import IterableCustomCard from "#/curriculum/fields/IterableCard"
import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import InputField from "#/curriculum/fields/Input"

import { CardFieldProps } from "@/interfaces/form.interface"
import { FormProvider, useForm } from "react-hook-form"
import { ThemeContextProps } from "@/interfaces/context.interface"

interface AccessoriesProps extends ThemeContextProps { }

const AccessoriesSection = ({ theme }: AccessoriesProps) => {
  const methods = useForm<AccessoriesProps>()

  const accessoriesFields: CardFieldProps[] = [
    {
      name: "name",
      label: "Nombre",
      placeholder: "Nombre del accesorio",
      component: <InputField control={methods.control} name="name" theme={theme} />
    },
    {
      name: "type",
      label: "Tipo",
      placeholder: "Tipo del accesorio",
      component: <InputField control={methods.control} name="type" theme={theme} />
    },
    {
      name: "series",
      label: "Serie",
      placeholder: "Serie del accesorio",
      component: <InputField control={methods.control} name="series" theme={theme} />
    },
    {
      name: "model",
      label: "Modelo",
      placeholder: "Modelo del accesorio",
      component: <InputField control={methods.control} name="model" theme={theme} />
    }
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
          fields={accessoriesFields}
          control={methods.control}
          titleButton="Agregar accesorio"
          limit={10}
        />
      </div>
    </FormProvider>
  )
}

export default AccessoriesSection