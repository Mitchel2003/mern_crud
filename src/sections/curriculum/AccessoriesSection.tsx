import HeaderCustom from "#/common/elements/HeaderCustom"
import IterableCard from "#/common/fields/CardIterable"
import InputField from "#/common/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"

interface AccessoriesProps extends ThemeContextProps { }
const AccessoriesSection = ({ theme }: AccessoriesProps) => {

  const accessoriesFields = [
    {
      name: "name",
      component: <InputField name="name" theme={theme} label="Nombre" />
    },
    {
      name: "type",
      component: <InputField name="type" theme={theme} label="Tipo" />
    },
    {
      name: "serie",
      component: <InputField name="serie" theme={theme} label="Serie" />
    },
    {
      name: "modelEquip",
      component: <InputField name="modelEquip" theme={theme} label="Modelo" />
    }
  ]

  return (
    <div className="space-y-6">
      <HeaderCustom
        to="component"
        theme={theme}
        title="Accesorios"
        className="text-2xl font-bold"
        span="Máximo 10 accesorios"
        iconSpan="alert"
      />

      <div className="grid grid-cols-1 gap-2">
        <HeaderCustom
          to="component"
          theme={theme}
          title="Crea accesorios para este equipo"
          span="Referencia periféricos, herramientas, etc."
          iconSpan="info"
        />

        <IterableCard
          limit={5}
          flex={'wrap'}
          theme={theme}
          name="accessories"
          fields={accessoriesFields}
          titleButton="Añadir accesorio para este equipo"
        />
      </div>
    </div>
  )
}

export default AccessoriesSection