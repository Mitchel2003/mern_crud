import { AccessoriesProps } from "@/interfaces/form.interface"
import IterableCardField from "#/curriculum/IterableCardField"
import { FormProvider, useForm } from "react-hook-form"

const AccessoriesSection = () => {
  const methods = useForm<AccessoriesProps>()

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <IterableCardField
          fields={fields}
          name="accessories"
          title="Accesorios"
          addButtonText="Nuevo accesorio"
        />
      </div>
    </FormProvider>
  )
}

const fields = [//  each object on array represents a field
  { name: "name", label: "Nombre", placeholder: "Nombre del accesorio" },
  { name: "type", label: "Tipo", placeholder: "Tipo de accesorio" },
  { name: "series", label: "Serie", placeholder: "Número de serie" },
  { name: "model", label: "Modelo", placeholder: "Modelo del accesorio" }
]

export default AccessoriesSection