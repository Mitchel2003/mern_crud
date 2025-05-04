import { typeMaintenanceCollection as typesMaintenance, manualsMaintenanceCollection as manualsMaintenance } from "@/constants/values.constants"
import { ThemeContextProps } from "@/interfaces/context.interface"
import HeaderCustom from "#/common/elements/HeaderCustom"
import CheckboxField from "#/common/fields/Checkbox"
import SelectField from "#/common/fields/Select"

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
        isMultiple
        theme={theme}
        name="typeMaintenance"
        label="Tipo mantenimiento"
        options={typesMaintenance.filter(mt => mt !== 'reacondicionamiento y ajuste')}
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
        isMultiple
        theme={theme}
        label="Manuales"
        name="manualsMaintenance"
        options={manualsMaintenance}
      />
    </div>

  </div>
)

export default MaintenanceSection