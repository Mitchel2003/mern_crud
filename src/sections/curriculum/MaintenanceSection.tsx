import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"

import { ThemeContextProps } from "@/interfaces/context.interface"

interface MaintenanceProps extends ThemeContextProps { }

const MaintenanceSection = ({ theme }: MaintenanceProps) => (
  <div className="space-y-6">
    {/* -------------------- Header -------------------- */}
    <HeaderCustom
      to="component"
      theme={theme}
      title="Mantenimiento"
      className="text-2xl font-light"
      span="Definir mantenimiento"
      iconSpan="alert"
    />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SelectField
        theme={theme}
        name="employmentMaintenance"
        label="Realización mantenimiento"
        placeholder="Seleccionar tipo"
        options={[
          { label: "Propio", value: "propio" },
          { label: "Contratado", value: "contratado" }
        ]}
      />
      <CheckboxField
        theme={theme}
        isMultiple={true}
        name="typeMaintenance"
        label="Tipo mantenimiento"
        options={['preventivo', 'correctivo', 'predictivo']}
      />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SelectField
        theme={theme}
        name="frequencyMaintenance"
        label="Frecuencia mantenimiento"
        placeholder="Seleccionar frecuencia"
        options={[
          { label: "6 meses", value: "6 meses" },
          { label: "1 año", value: "12 meses" }
        ]}
      />
      <CheckboxField
        theme={theme}
        label="Manuales"
        name="manualsMaintenance"
        options={['servicio', 'componentes', 'usuario', 'despiece']}
      />
    </div>

  </div>
)

export default MaintenanceSection