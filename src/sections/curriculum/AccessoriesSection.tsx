import HeaderCustom from "#/curriculum/reusables/HeaderCustom"
import IterableCard from "#/curriculum/fields/IterableCard"
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
      component: <InputField name="name" theme={theme} label="Nombre" control={methods.control} />
    },
    {
      name: "type",
      component: <InputField name="type" theme={theme} label="Tipo" control={methods.control} />
    },
    {
      name: "series",
      component: <InputField name="series" theme={theme} label="Serie" control={methods.control} />
    },
    {
      name: "model",
      component: <InputField name="model" theme={theme} label="Modelo" control={methods.control} />
    }
  ]

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <HeaderCustom
          theme={theme}
          to="section"
          icon="alert"
          title="Accesorios"
          description="Máximo 10 accesorios"
        />

        <IterableCard
          limit={10}
          theme={theme}
          name="accessories"
          fields={accessoriesFields}
          control={methods.control}
          titleButton="Agregar accesorio"
        />
      </div>
    </FormProvider>
  )
}

export default AccessoriesSection