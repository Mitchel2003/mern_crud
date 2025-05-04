import HeaderCustom from "#/common/elements/HeaderCustom"
import IterableCard from "#/common/fields/CardIterable"
import InputField from "#/common/fields/Input"

import { ThemeContextProps } from "@/interfaces/context.interface"

interface AccessoriesProps extends ThemeContextProps { }
const AccessoriesSection = ({ theme }: AccessoriesProps) => (
  <div className="space-y-6">
    <HeaderCustom
      to="component"
      theme={theme}
      iconSpan="alert"
      title="Accesorios"
      span="Máximo 5 accesorios"
      className="text-2xl font-light"
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
        theme={theme}
        name="newAccessories"
        titleButton="Añadir accesorio para este equipo"
        fields={accessoriesFields.map(field => ({ name: field.name, component: <InputField {...field} theme={theme} /> }))}
      />
    </div>
  </div>
)

export default AccessoriesSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const accessoriesFields = [
  { name: "newAccessories.name", label: "Nombre" },
  { name: "newAccessories.type", label: "Tipo" },
  { name: "newAccessories.serie", label: "Serie" },
  { name: "newAccessories.modelEquip", label: "Modelo" }
]